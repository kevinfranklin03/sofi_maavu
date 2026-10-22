import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './enquiries.mjs';
const input = { name: 'Website test', contact: '+91 9000000000', message: 'Local delivery test', website: '' };
const request = (body = input, headers = {}) => new Request('https://amma-nana-foods.com/api/enquiries', {
  method: 'POST', headers: { Origin: 'https://amma-nana-foods.com', 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...headers }, body: JSON.stringify(body),
});
const limiter = { limit: async () => ({ success: true }) };
test('delivers validated text only to the fixed business inbox', async () => {
  let sent;
  const response = await worker.fetch(request({ ...input, to: 'attacker@example.com' }), { EMAIL: { send: async mail => { sent = mail; } }, ENQUIRY_LIMITER: limiter });
  assert.equal(response.status, 200);
  assert.equal(sent.to, 'ammananafoodschennai@gmail.com');
  assert.equal(sent.from.email, 'enquiries@amma-nana-foods.com');
  assert.ok(sent.text.includes(input.message));
});
test('rejects spam, invalid payloads and excessive requests without sending', async () => {
  let sends = 0;
  const env = { EMAIL: { send: async () => sends++ }, ENQUIRY_LIMITER: limiter };
  for (const body of [{ ...input, website: 'spam' }, { ...input, name: 'x\nBcc: bad' }, { ...input, contact: 'abc' }, { ...input, message: ' ' }]) {
    assert.equal((await worker.fetch(request(body), env)).status, 400);
  }
  assert.equal((await worker.fetch(request(input, { Origin: 'https://other.example' }), env)).status, 403);
  assert.equal((await worker.fetch(request({ ...input, message: 'x'.repeat(20000) }), env)).status, 413);
  assert.equal((await worker.fetch(request(), { ...env, ENQUIRY_LIMITER: { limit: async () => ({ success: false }) } })).status, 429);
  assert.equal(sends, 0);
});
test('fails honestly when bindings are missing or delivery fails', async () => {
  assert.equal((await worker.fetch(request(), {})).status, 503);
  const response = await worker.fetch(request(), { ENQUIRY_LIMITER: limiter, EMAIL: { send: async () => { throw new Error('secret provider detail'); } } });
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes('secret provider detail'));
});
