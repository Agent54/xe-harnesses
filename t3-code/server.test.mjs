import assert from 'node:assert/strict';
import { once } from 'node:events';
import http from 'node:http';
import net from 'node:net';
import { test } from 'node:test';
import { createAppServer, desktopBootstrapToken, parsePublicUrl } from './server.mjs';

const appUrl = 'https://t3-code_harness-t3-code.app.localhost';
const host = new URL(appUrl).host;

function request(port, path = '/', headers = {}, method = 'GET', body) {
  return new Promise((resolve, reject) => {
    const outgoing = http.request({ hostname: '127.0.0.1', port, path, method,
      headers: { host, ...headers } }, incoming => {
      const chunks = [];
      incoming.on('data', chunk => chunks.push(chunk));
      incoming.on('error', reject);
      incoming.on('end', () => resolve({ status: incoming.statusCode,
        headers: incoming.headers, body: Buffer.concat(chunks).toString() }));
    });
    outgoing.on('error', reject);
    outgoing.end(body);
  });
}

async function fixture(t) {
  const seen = [];
  const backendSockets = new Set();
  let authenticated = true;
  let rejectLogin = false;
  let events;
  const backend = http.createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString();
    seen.push({ path: request.url, headers: request.headers, body });
    if (request.url === '/api/auth/session') {
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify({ authenticated: authenticated && request.headers.cookie === 't3_session=browser' }));
    } else if (request.url === '/api/auth/browser-session') {
      assert.equal(JSON.parse(body).credential, 'private-bootstrap');
      if (rejectLogin) {
        response.writeHead(401, { 'content-type': 'application/json' }).end('{"authenticated":false}');
        return;
      }
      response.setHeader('content-type', 'application/json');
      response.setHeader('set-cookie', ['t3_session=browser; HttpOnly; Path=/; SameSite=Lax']);
      response.end(JSON.stringify({ authenticated: true }));
    } else if (request.url === '/api/private' && !request.headers.cookie) {
      response.writeHead(401).end('Unauthorized');
    } else if (request.url === '/upload') {
      response.writeHead(201, { 'content-type': 'text/plain' }).end(body);
    } else if (request.url === '/events') {
      events = response;
      response.writeHead(200, { 'content-type': 'text/event-stream' });
      response.flushHeaders();
    } else {
      response.end('<html>Full T3 UI</html>');
    }
  });
  backend.on('connection', socket => {
    backendSockets.add(socket);
    socket.on('close', () => backendSockets.delete(socket));
  });
  backend.on('upgrade', (request, socket, head) => {
    if (request.headers.cookie !== 't3_session=browser') {
      socket.end('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n');
      return;
    }
    socket.write('HTTP/1.1 101 Switching Protocols\r\nConnection: Upgrade\r\nUpgrade: websocket\r\n\r\n');
    if (head.length) socket.write(head);
    socket.on('data', data => socket.write(data));
  });
  backend.listen(0, '127.0.0.1');
  await once(backend, 'listening');
  let credentials = 0;
  const app = createAppServer({ upstream: `http://127.0.0.1:${backend.address().port}`,
    publicUrl: appUrl, bootstrapCredential: () => { credentials++; return 'private-bootstrap'; } });
  app.listen(0, '127.0.0.1');
  await once(app, 'listening');
  t.after(async () => {
    app.closeConnections();
    for (const socket of backendSockets) socket.destroy();
    await Promise.all([new Promise(resolve => app.close(resolve)), new Promise(resolve => backend.close(resolve))]);
  });
  return { port: app.address().port, seen, credentials: () => credentials,
    expire: () => { authenticated = false; }, rejectLogin: () => { rejectLogin = true; },
    sendEvent: () => events.end('data: turn completed\n\n') };
}

test('new browser gets a native cookie, then the full UI without exposing the bootstrap token', async t => {
  const app = await fixture(t);
  const login = await request(app.port, '/thread/example?panel=files', {
    accept: 'text/html', 'accept-encoding': 'gzip, br', 'x-forwarded-proto': 'https',
  });
  assert.equal(login.status, 303);
  assert.equal(login.headers.location, '/thread/example?panel=files');
  assert.equal(login.headers['cache-control'], 'no-store');
  assert.match(login.headers['set-cookie'][0], /HttpOnly/);
  assert.doesNotMatch(JSON.stringify(login), /private-bootstrap/);
  const ui = await request(app.port, login.headers.location, { accept: 'text/html', cookie: 't3_session=browser' });
  assert.equal(ui.status, 200);
  assert.match(ui.body, /Full T3 UI/);
  assert.equal(app.credentials(), 1);
  assert.equal(app.seen[1].headers.host, host);
  assert.equal(app.seen[1].headers['x-forwarded-proto'], 'https');
  assert.equal(app.seen[1].headers['accept-encoding'], 'identity');
  assert.equal(app.seen[1].headers.accept, 'application/json');
  app.expire();
  const renewed = await request(app.port, '/', { accept: 'text/html', cookie: 't3_session=browser' });
  assert.equal(renewed.status, 303);
  assert.equal(app.credentials(), 2);
});

test('pair screen redirects home and non-browser API calls still require native auth', async t => {
  const app = await fixture(t);
  const paired = await request(app.port, '/pair', { accept: 'text/html' });
  assert.equal(paired.headers.location, '/');
  const api = await request(app.port, '/api/private', { accept: 'text/html' });
  assert.equal(api.status, 401);
  const health = await request(app.port, '/healthz');
  assert.equal(health.status, 200);
  assert.equal(app.credentials(), 1);
});

test('bootstrap rejects other hosts, cross-origin requests, and proxy escape URLs', async t => {
  const app = await fixture(t);
  for (const [path, headers] of [
    ['/', { host: 'attacker.example' }],
    ['/', { origin: 'https://attacker.example' }],
    ['//attacker.example/', {}],
    ['http://attacker.example/', {}],
    ['/\\attacker.example/', {}],
  ]) {
    const result = await request(app.port, path, { accept: 'text/html', ...headers });
    assert.equal(result.status, 403);
  }
  assert.equal(app.seen.length, 0);
  assert.equal(app.credentials(), 0);
});

test('uploads preserve their body and content type', async t => {
  const app = await fixture(t);
  const upload = await request(app.port, '/upload', { 'content-type': 'application/octet-stream' }, 'POST', 'file contents');
  assert.equal(upload.status, 201);
  assert.equal(upload.body, 'file contents');
  assert.equal(app.seen[0].headers['content-type'], 'application/octet-stream');
});

test('event-stream headers and events arrive without buffering the whole response', async t => {
  const app = await fixture(t);
  const incoming = await new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port: app.port, path: '/events', headers: { host } }, resolve)
      .on('error', reject);
  });
  assert.equal(incoming.headers['content-type'], 'text/event-stream');
  app.sendEvent();
  const chunks = [];
  for await (const chunk of incoming) chunks.push(chunk);
  assert.equal(Buffer.concat(chunks).toString(), 'data: turn completed\n\n');
});

test('a rejected native bootstrap never falls back to an unauthenticated UI', async t => {
  const app = await fixture(t);
  app.rejectLogin();
  const result = await request(app.port, '/', { accept: 'text/html' });
  assert.equal(result.status, 503);
  assert.equal(result.headers['set-cookie'], undefined);
  assert.match(result.body, /http-equiv="refresh"/);
  assert.doesNotMatch(result.body, /private-bootstrap|Full T3 UI/);
});

test('authenticated websocket traffic is forwarded; unauthorized upgrades stay rejected', async t => {
  const app = await fixture(t);
  for (const authorized of [false, true]) {
    const socket = net.connect(app.port, '127.0.0.1');
    t.after(() => socket.destroy());
    await once(socket, 'connect');
    socket.write(`GET /ws HTTP/1.1\r\nHost: ${host}\r\nConnection: Upgrade\r\nUpgrade: websocket\r\n${authorized ? 'Cookie: t3_session=browser\r\n' : ''}\r\n`);
    const [handshake] = await once(socket, 'data');
    assert.match(handshake.toString(), authorized ? /101 Switching Protocols/ : /401 Unauthorized/);
    if (authorized) {
      socket.write('streamed event');
      const [echo] = await once(socket, 'data');
      assert.equal(echo.toString(), 'streamed event');
    }
    socket.destroy();
  }
});

test('Electron credentials rotate and PUBLIC_URL must be an origin', () => {
  assert.equal(desktopBootstrapToken('secret', 0), desktopBootstrapToken('secret', 1));
  assert.notEqual(desktopBootstrapToken('secret', 0), desktopBootstrapToken('secret', 12 * 60 * 60 * 1000));
  assert.equal(parsePublicUrl(appUrl).origin, appUrl);
  for (const value of ['file:///workspace', 'https://user:password@example.com', 'https://example.com/path', 'https://example.com/?token=secret']) {
    assert.throws(() => parsePublicUrl(value));
  }
});
