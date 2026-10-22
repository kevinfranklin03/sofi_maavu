const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { SMTPServer } = require('smtp-server');
const { createApp, createDelivery } = require('./app.cjs');

const valid = { name: 'Local test customer', contact: '+91 9000000000', message: 'Please supply 20 kg of dosa batter.' };
async function start(t, app) {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}
const post = (base, body) => fetch(`${base}/api/enquiries`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

test('a real SMTP transaction delivers the enquiry to the configured inbox', async t => {
  let received;
  let envelope;
  const smtp = new SMTPServer({
    authOptional: true, disabledCommands: ['AUTH', 'STARTTLS'],
    onData(stream, session, callback) {
      let raw = '';
      stream.on('data', chunk => { raw += chunk; });
      stream.on('end', () => { received = raw; envelope = session.envelope; callback(); });
    },
  });
  await new Promise(resolve => smtp.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => smtp.close(resolve)));
  const delivery = createDelivery({ SMTP_HOST: '127.0.0.1', SMTP_PORT: String(smtp.server.address().port),
    SMTP_FROM: 'website@example.test', ENQUIRY_TO: 'inbox@example.test', SMTP_ALLOW_PLAINTEXT: 'true' });
  const base = await start(t, createApp({ delivery }));
  const response = await post(base, { ...valid, to: 'attacker@example.test' });
  assert.equal(response.status, 200);
  assert.deepEqual(envelope.rcptTo.map(recipient => recipient.address), ['inbox@example.test']);
  assert.match(received, /Contact number: \+91 9000000000/);
  assert.match(received, /20 kg of dosa batter/);
});

test('invalid fields, bots, malformed JSON, and large payloads never reach delivery', async t => {
  let count = 0;
  const base = await start(t, createApp({ limit: 30, delivery: { ready: true, send: async () => { count++; } } }));
  for (const body of [null, [], {}, { ...valid, name: ' ' }, { ...valid, name: 'a\r\nBcc: attacker' },
    { ...valid, contact: '-------' }, { ...valid, message: 'x'.repeat(2001) }, { ...valid, website: 'bot' }]) {
    assert.equal((await post(base, body)).status, 400);
  }
  const malformed = await fetch(`${base}/api/enquiries`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(malformed.status, 400);
  assert.equal((await post(base, { ...valid, message: 'x'.repeat(20000) })).status, 413);
  assert.equal(count, 0);
});

test('unconfigured or failed delivery returns an error, never a success', async t => {
  const unavailable = await start(t, createApp({ delivery: { ready: false } }));
  assert.equal((await post(unavailable, valid)).status, 503);
  const broken = await start(t, createApp({ delivery: { ready: true, send: async () => { throw new Error('smtp failure'); } } }));
  assert.equal((await post(broken, valid)).status, 502);
});

test('rate limits block repeated submissions', async t => {
  const base = await start(t, createApp({ limit: 2, delivery: { ready: true, send: async () => {} } }));
  assert.equal((await post(base, valid)).status, 200);
  assert.equal((await post(base, valid)).status, 200);
  const blocked = await post(base, valid);
  assert.equal(blocked.status, 429);
  assert.match((await blocked.json()).error, /wait 15 minutes/);
});

test('production serves page deep links and keeps API errors as JSON', async t => {
  const buildDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'amma-nana-test-'));
  await fs.writeFile(path.join(buildDirectory, 'index.html'), '<html><title>Amma Nana Foods</title></html>');
  // Delete only the single fixture file and its empty directory created above.
  t.after(async () => { await fs.unlink(path.join(buildDirectory, 'index.html')); await fs.rmdir(buildDirectory); });
  const base = await start(t, createApp({ production: true, buildDirectory, delivery: { ready: false } }));
  const page = await fetch(`${base}/contact`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-type'), /text\/html/);
  assert.match(await page.text(), /Amma Nana Foods/);
  const api = await fetch(`${base}/api/missing`);
  assert.equal(api.status, 404);
  assert.match(api.headers.get('content-type'), /application\/json/);
});
