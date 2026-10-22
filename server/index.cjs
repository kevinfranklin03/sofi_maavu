const { createApp, createDelivery } = require('./app.cjs');
const delivery = createDelivery();
const port = Number(process.env.API_PORT || 3002);
const host = process.env.API_HOST || '127.0.0.1';
const server = createApp({ delivery, production: process.env.NODE_ENV === 'production' }).listen(port, host, () => {
  console.log(`Enquiry API: http://${host}:${port}`);
  console.log(delivery.ready ? 'SMTP delivery configured.' : 'SMTP is not configured. Add credentials to .env.server.local to enable delivery.');
});
server.on('error', error => { console.error('API startup failed:', error.code); process.exitCode = 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
