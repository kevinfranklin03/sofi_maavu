const express = require('express');
const { rateLimit } = require('express-rate-limit');
const nodemailer = require('nodemailer');
const path = require('node:path');

function createDelivery(env = process.env) {
  const port = Number(env.SMTP_PORT || 587);
  const secure = port === 465;
  const ready = Boolean(env.SMTP_HOST && env.SMTP_FROM && env.ENQUIRY_TO &&
    Number.isInteger(port) && port > 0 && port < 65536 &&
    (!env.SMTP_USER || env.SMTP_PASS));
  const transporter = ready ? nodemailer.createTransport({
    host: env.SMTP_HOST, port, secure,
    requireTLS: !secure && env.SMTP_ALLOW_PLAINTEXT !== 'true',
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
    disableFileAccess: true, disableUrlAccess: true,
  }) : null;
  return {
    ready,
    async send(enquiry) {
      if (!transporter) throw new Error('SMTP_NOT_CONFIGURED');
      const result = await transporter.sendMail({
        from: env.SMTP_FROM,
        to: env.ENQUIRY_TO,
        subject: 'New Amma Nana Foods enquiry',
        text: `Name: ${enquiry.name}\nContact number: ${enquiry.contact}\n\n${enquiry.message}`,
      });
      if (!result.accepted?.length) throw new Error('SMTP_REJECTED');
    },
  };
}

function validateEnquiry(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const { name, contact, message, website } = body;
  if ([name, contact, message].some(value => typeof value !== 'string')) return null;
  const enquiry = { name: name.trim(), contact: contact.trim(), message: message.trim() };
  if (!enquiry.name || enquiry.name.length > 80 || /[\r\n\x00-\x1f]/.test(enquiry.name) ||
      !/^[+0-9() .-]{7,30}$/.test(enquiry.contact) ||
      enquiry.contact.replace(/\D/g, '').length < 7 ||
      !enquiry.message || enquiry.message.length > 2000 || /\x00/.test(enquiry.message) ||
      (website !== undefined && (typeof website !== 'string' || website !== ''))) return null;
  return enquiry;
}

function createApp({ delivery = createDelivery(), limit = 5, production = false,
  buildDirectory = path.resolve(__dirname, '../build') } = {}) {
  const app = express();
  app.disable('x-powered-by');
  // Trust only an explicitly configured number of deployment proxy hops.
  const hops = Number(process.env.TRUST_PROXY_HOPS || 0);
  if (Number.isInteger(hops) && hops > 0) app.set('trust proxy', hops);
  app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.get('/api/health', (_req, res) => res.json({ ok: true, emailConfigured: delivery.ready }));
  app.post('/api/enquiries', rateLimit({
    windowMs: 15 * 60 * 1000, limit, standardHeaders: 'draft-8', legacyHeaders: false,
    message: { error: 'Too many enquiries. Please wait 15 minutes and try again.' },
  }), (req, res, next) => {
    if (!req.is('application/json')) return res.status(415).json({ error: 'Please send JSON.' });
    next();
  }, express.json({ limit: '16kb' }), async (req, res) => {
    const enquiry = validateEnquiry(req.body);
    if (!enquiry) return res.status(400).json({ error: 'Enter your name, a valid phone number and a message of up to 2,000 characters.' });
    if (!delivery.ready) return res.status(503).json({ error: 'Email delivery is not configured yet. Please contact us by email.' });
    try {
      await delivery.send(enquiry);
      return res.status(200).json({ message: 'Thank you! Your enquiry has been sent. We will contact you using the number you provided.' });
    } catch (error) {
      // Log an error code only; never log enquiry content or SMTP credentials.
      console.error('Enquiry delivery failed:', error.code || 'DELIVERY_FAILED');
      return res.status(502).json({ error: 'We could not send your enquiry. Your message is still here; please try again shortly.' });
    }
  });
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found.' }));
  if (production) {
    app.use(express.static(buildDirectory));
    app.get('/{*path}', (_req, res) => res.sendFile(path.join(buildDirectory, 'index.html')));
  }
  app.use((error, _req, res, _next) => {
    const status = error.type === 'entity.too.large' ? 413 : error.type === 'entity.parse.failed' ? 400 : 500;
    res.status(status).json({ error: status === 413 ? 'Your enquiry is too large.' : status === 400 ? 'Invalid JSON request.' : 'Something went wrong. Please try again.' });
  });
  return app;
}

module.exports = { createApp, createDelivery, validateEnquiry };
