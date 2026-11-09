import { createServer } from 'node:http';
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { timingSafeEqual } from 'node:crypto';
import { BACKGROUND_CONTEXT } from '@earendil-works/chord/context';
import { createModels } from '@earendil-works/pi-ai/models';
import { openaiProvider } from '@earendil-works/pi-ai/providers/openai';
import { AssistantEntry, createRegistry, Harness } from '@earendil-works/pi-durable';
import { CodingTools } from '@earendil-works/pi-durable/tools';
import { NodeExecutionEnv } from '@earendil-works/pi-durable/env/node';
import { openNodeSqliteStorage } from '@earendil-works/pi-durable/storage/sqlite/node';

if (!process.env.PI_TOKEN) throw new Error('PI_TOKEN is required');
const publicUrl = new URL(process.env.PUBLIC_URL || 'http://localhost:8080');
if (!['http:', 'https:'].includes(publicUrl.protocol) || publicUrl.username || publicUrl.password ||
    publicUrl.pathname !== '/' || publicUrl.search || publicUrl.hash) {
  throw new Error('PUBLIC_URL must be an http(s) origin without credentials, path, query, or fragment');
}
const context = BACKGROUND_CONTEXT;
const models = createModels();
models.setProvider(openaiProvider());
const registry = createRegistry();
registry.install(CodingTools);
const harness = await Harness.open(await openNodeSqliteStorage('/home/node/data/session.sqlite'), {
  models, registry,
  env: ({ cwd }) => new NodeExecutionEnv({ cwd: cwd ?? '/workspace' }),
}, context);
const root = await harness.root(context, {
  agent: { model: { provider: 'openai', modelId: process.env.PI_MODEL || 'gpt-6-sol' }, cwd: '/workspace' },
});
harness.resume();

function authorized(header) {
  const actual = Buffer.from(header || '');
  const expected = Buffer.from(`Bearer ${process.env.PI_TOKEN}`);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
function reply(res, status, body) {
  if (res.destroyed) return;
  res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}
const server = createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') return reply(res, 200, { status: 'ok' });
  if (!authorized(req.headers.authorization)) return reply(res, 401, { error: 'Unauthorized' });
  if (req.method !== 'POST' || req.url !== '/message') return reply(res, 404, { error: 'Use POST /message' });
  try {
    let bytes = 0;
    const chunks = [];
    for await (const chunk of req) {
      bytes += chunk.length;
      if (bytes > 65536) return reply(res, 413, { error: 'Message too large' });
      chunks.push(chunk);
    }
    let body;
    try { body = JSON.parse(Buffer.concat(chunks).toString()); }
    catch { return reply(res, 400, { error: 'Invalid JSON' }); }
    if (typeof body?.message !== 'string' || !body.message.trim() ||
        typeof body.requestId !== 'string' || !body.requestId.trim() || body.requestId.length > 200) {
      return reply(res, 400, { error: 'message and requestId must be nonempty strings (requestId <= 200 characters)' });
    }
    // Reusing requestId retrieves the original submission after a client or process restart.
    const submission = await root.submit({ type: 'input', content: body.message, requestId: body.requestId }, context);
    const settled = await submission.wait(context);
    const answer = settled.status === 'done' && settled.type === 'input'
      ? await root.commit((tx) => tx.entry(AssistantEntry, settled.answer), context) : null;
    reply(res, 200, { submissionId: submission.id, status: settled.status, answer: answer?.model ?? null });
  } catch (error) {
    console.error(error);
    reply(res, 500, { error: 'Request failed; retry with the same requestId' });
  }
});
server.requestTimeout = 30000;
server.listen(8080, '0.0.0.0', () => console.log(`Pi Durable: POST ${new URL('/message', publicUrl)}`));
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  server.close();
  await harness.close(context);
  server.closeAllConnections();
}
process.on('SIGTERM', () => void stop());
process.on('SIGINT', () => void stop());
harness.closed.then((end) => {
  if (end.kind === 'failed') {
    console.error(end.error);
    server.close();
    server.closeAllConnections();
    process.exitCode = 1;
  }
});
