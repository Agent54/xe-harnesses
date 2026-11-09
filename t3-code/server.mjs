import { spawn } from 'node:child_process';
import { createHmac, randomBytes } from 'node:crypto';
import http from 'node:http';
import { pathToFileURL } from 'node:url';

const publicPort = 3773;
const backendPort = 3774;

const isLocalPath = path => typeof path === 'string' && path.startsWith('/') && !/^\/[\\/]/.test(path);

// Match T3 0.1.7's rotating Electron bootstrap credential, shared over stdin only.
export function desktopBootstrapToken(secret, now = Date.now()) {
  const window = Math.floor(now / (12 * 60 * 60 * 1000));
  return createHmac('sha256', secret).update(`t3-desktop-bootstrap:${window}`).digest('hex');
}

export function parsePublicUrl(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash) {
    throw new Error('PUBLIC_URL must be an http(s) origin without credentials, path, query, or fragment');
  }
  return url;
}

function backendJson(upstream, path, headers = {}, body) {
  return new Promise((resolve, reject) => {
    const request = http.request(new URL(path, upstream), {
      method: body === undefined ? 'GET' : 'POST',
      headers: { ...headers, accept: 'application/json', 'accept-encoding': 'identity',
        ...(body === undefined ? {} : { 'content-type': 'application/json' }) },
      timeout: 10_000,
    }, response => {
      const chunks = [];
      let length = 0;
      response.on('data', chunk => {
        length += chunk.length;
        if (length > 64 * 1024) response.destroy(new Error('Unexpectedly large T3 authentication response'));
        else chunks.push(chunk);
      });
      response.on('error', reject);
      response.on('end', () => {
        try {
          resolve({ status: response.statusCode, headers: response.headers,
            body: JSON.parse(Buffer.concat(chunks).toString()) });
        } catch {
          reject(new Error('T3 returned an invalid authentication response'));
        }
      });
    });
    request.on('timeout', () => request.destroy(new Error('T3 authentication request timed out')));
    request.on('error', reject);
    request.end(body === undefined ? undefined : JSON.stringify(body));
  });
}

export function createAppServer({ upstream, publicUrl, bootstrapCredential }) {
  const url = parsePublicUrl(publicUrl);
  const allowedHosts = new Set([url.host, `localhost:${publicPort}`, `127.0.0.1:${publicPort}`]);
  const sockets = new Set();
  const headersFor = request => ({ ...request.headers });
  const server = http.createServer(async (request, response) => {
    if (!allowedHosts.has(request.headers.host) || !isLocalPath(request.url)) {
      response.writeHead(403).end('Unrecognized app host');
      return;
    }
    const path = new URL(request.url, 'http://localhost').pathname;
    if (path === '/healthz' && request.method === 'GET') {
      try {
        const result = await backendJson(upstream, '/api/auth/session');
        response.writeHead(result.status === 200 ? 200 : 503, { 'cache-control': 'no-store' }).end();
      } catch {
        response.writeHead(503).end();
      }
      return;
    }
    const document = request.method === 'GET' && request.headers.accept?.includes('text/html') &&
      (!request.headers['sec-fetch-dest'] || request.headers['sec-fetch-dest'] === 'document') &&
      !/^\/(api|oauth|mcp|\.well-known|guest)(\/|$)/.test(path);
    if (document) {
      const origin = request.headers.origin;
      if (origin && origin !== url.origin && origin !== `http://${request.headers.host}`) {
        response.writeHead(403).end('Cross-origin app bootstrap is not allowed');
        return;
      }
      try {
        const headers = headersFor(request);
        // Do not forward navigation headers that describe a different request body.
        delete headers['content-length'];
        delete headers['transfer-encoding'];
        const session = await backendJson(upstream, '/api/auth/session', headers);
        if (session.status !== 200) throw new Error('T3 session lookup failed');
        if (!session.body.authenticated) {
          const login = await backendJson(upstream, '/api/auth/browser-session', headers,
            { credential: bootstrapCredential() });
          const cookies = login.headers['set-cookie'];
          if (login.status !== 200 || !login.body.authenticated || !cookies?.length) {
            throw new Error('T3 desktop bootstrap failed');
          }
          response.writeHead(303, {
            'set-cookie': cookies,
            location: path === '/pair' ? '/' : request.url,
            'cache-control': 'no-store',
            'referrer-policy': 'no-referrer',
          }).end();
          return;
        }
        if (path === '/pair') {
          response.writeHead(303, { location: '/', 'cache-control': 'no-store' }).end();
          return;
        }
      } catch {
        response.writeHead(503, {
          'retry-after': '2', 'cache-control': 'no-store', 'content-type': 'text/html; charset=utf-8',
        }).end('<!doctype html><title>Starting T3 Code</title><meta http-equiv="refresh" content="2"><p>T3 Code is starting. This page will retry automatically.</p>');
        return;
      }
    }
    const proxy = http.request(new URL(request.url, upstream), {
      method: request.method, headers: headersFor(request),
    }, incoming => {
      response.writeHead(incoming.statusCode, incoming.headers);
      response.flushHeaders();
      incoming.on('error', () => response.destroy());
      incoming.pipe(response);
    });
    proxy.on('error', () => {
      if (!response.headersSent) response.writeHead(502);
      response.end('T3 Code is unavailable');
    });
    request.on('aborted', () => proxy.destroy());
    response.on('close', () => proxy.destroy());
    request.pipe(proxy);
  });
  server.on('upgrade', (request, socket, head) => {
    if (!allowedHosts.has(request.headers.host) || !isLocalPath(request.url)) {
      socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');
      return;
    }
    const proxy = http.request(new URL(request.url, upstream), { headers: headersFor(request) });
    proxy.on('upgrade', (incoming, backend, backendHead) => {
      const headers = incoming.rawHeaders;
      let handshake = `HTTP/1.1 ${incoming.statusCode} ${incoming.statusMessage}\r\n`;
      for (let i = 0; i < headers.length; i += 2) handshake += `${headers[i]}: ${headers[i + 1]}\r\n`;
      socket.write(`${handshake}\r\n`);
      if (backendHead.length) socket.write(backendHead);
      if (head.length) backend.write(head);
      backend.on('error', () => socket.destroy());
      socket.on('error', () => backend.destroy());
      socket.on('close', () => backend.destroy());
      backend.on('close', () => socket.destroy());
      backend.pipe(socket).pipe(backend);
    });
    proxy.on('response', incoming => {
      // Preserve native authentication failures instead of upgrading an unauthorized socket.
      socket.end(`HTTP/1.1 ${incoming.statusCode} ${incoming.statusMessage}\r\nConnection: close\r\n\r\n`);
      incoming.resume();
    });
    proxy.on('error', () => socket.destroy());
    socket.on('error', () => proxy.destroy());
    proxy.end();
  });
  server.on('connection', socket => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });
  server.closeConnections = () => { for (const socket of sockets) socket.destroy(); };
  return server;
}

async function start() {
  const publicUrl = parsePublicUrl(process.env.PUBLIC_URL).origin;
  const secret = randomBytes(32).toString('hex');
  const upstream = `http://127.0.0.1:${backendPort}`;
  // stdin survives the npm launcher's exec chain; extra launch FDs do not.
  const child = spawn('t3', ['serve', '--bootstrap-fd', '0'], {
    stdio: ['pipe', 'inherit', 'inherit'],
  });
  child.stdin.on('error', () => {});
  child.stdin.end(`${JSON.stringify({
    mode: 'desktop', noBrowser: true, host: '127.0.0.1', port: backendPort,
    desktopBootstrapToken: desktopBootstrapToken(secret), desktopBootstrapSecret: secret,
    shellEnvironmentPrepared: true, tailscaleServeEnabled: false, tailscaleServePort: 443,
  })}\n`);
  const server = createAppServer({ upstream, publicUrl, bootstrapCredential: () => desktopBootstrapToken(secret) });
  let stopping = false;
  const stop = signal => {
    if (stopping) return;
    stopping = true;
    server.close();
    server.closeConnections();
    child.kill(signal);
    setTimeout(() => child.kill('SIGKILL'), 25_000).unref();
  };
  process.on('SIGTERM', () => stop('SIGTERM'));
  process.on('SIGINT', () => stop('SIGINT'));
  child.on('error', () => {
    console.error('[t3-code] Could not start the T3 backend.');
    server.closeConnections();
    process.exit(1);
  });
  child.on('exit', code => {
    server.closeConnections();
    process.exit(stopping ? (process.exitCode || 0) : (code || 1));
  });
  server.on('error', () => {
    console.error('[t3-code] Could not bind the Xe app port.');
    stop('SIGTERM');
    process.exitCode = 1;
  });
  server.listen(publicPort, '0.0.0.0', () => {
    console.log(`[t3-code] Xe desktop bootstrap enabled at ${publicUrl}`);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  start().catch(() => { console.error('[t3-code] Invalid Xe app configuration.'); process.exit(1); });
}
