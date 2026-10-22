// Deployed as the amma-nana-enquiries Worker on amma-nana-foods.com/api/*.
// Mail is addressed only to the verified business inbox. No credentials reach the browser.
const recipient = 'ammananafoodschennai@gmail.com';
const origin = 'https://amma-nana-foods.com';
const json = (body, status = 200) => Response.json(body, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
});

export function validateEnquiry(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  if (['name', 'contact', 'message'].some(key => typeof body[key] !== 'string')) return null;
  const name = body.name.trim(), contact = body.contact.trim(), message = body.message.trim();
  if (!name || name.length > 80 || /[\r\n\x00-\x1f]/.test(name) ||
      !/^[+0-9() .-]{7,30}$/.test(contact) || contact.replace(/\D/g, '').length < 7 ||
      !message || message.length > 2000 || /\x00/.test(message) ||
      (body.website !== undefined && body.website !== '')) return null;
  return { name, contact, message };
}

async function readBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('EMPTY');
  const chunks = []; let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 16384) { await reader.cancel(); throw new Error('TOO_LARGE'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path === '/api/health' && request.method === 'GET') {
      return json({ ok: true, emailConfigured: Boolean(env.EMAIL && env.ENQUIRY_LIMITER) });
    }
    if (path !== '/api/enquiries') return json({ error: 'API endpoint not found.' }, 404);
    if (request.method !== 'POST') return json({ error: 'Use POST to send an enquiry.' }, 405);
    if (request.headers.get('Origin') !== origin) return json({ error: 'Please use the enquiry form on our website.' }, 403);
    if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return json({ error: 'Please send JSON.' }, 415);
    if (!env.EMAIL || !env.ENQUIRY_LIMITER) return json({ error: 'Email delivery is temporarily unavailable. Please email our team.' }, 503);
    try {
      const ip = request.headers.get('CF-Connecting-IP');
      if (!ip) return json({ error: 'Unable to verify your connection.' }, 403);
      const { success } = await env.ENQUIRY_LIMITER.limit({ key: ip });
      if (!success) return json({ error: 'Too many enquiries. Please wait a minute and try again.' }, 429);
      let body;
      try { body = await readBody(request); }
      catch (error) { return json({ error: error.message === 'TOO_LARGE' ? 'Your enquiry is too large.' : 'Invalid enquiry request.' }, error.message === 'TOO_LARGE' ? 413 : 400); }
      const enquiry = validateEnquiry(body);
      if (!enquiry) return json({ error: 'Enter your name, a valid phone number and a message of up to 2,000 characters.' }, 400);
      await env.EMAIL.send({
        from: { email: 'enquiries@amma-nana-foods.com', name: 'Amma Nana Foods website' },
        to: recipient,
        subject: 'New Amma Nana Foods enquiry',
        text: `New website enquiry\n\nName: ${enquiry.name}\nContact number: ${enquiry.contact}\n\n${enquiry.message}`,
      });
      return json({ message: 'Thank you! Your enquiry has been sent. We will contact you using the number you provided.' });
    } catch {
      // Never expose provider errors or log customer details.
      return json({ error: 'We could not send your enquiry. Your message is still here; please try again shortly.' }, 502);
    }
  },
};
