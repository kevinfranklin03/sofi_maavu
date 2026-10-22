const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  app.use(createProxyMiddleware('/api', {
    target: `http://127.0.0.1:${process.env.API_PORT || 3002}`,
    changeOrigin: true,
    proxyTimeout: 60000,
    onError(_error, _req, res) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'The enquiry service is unavailable. Please try again shortly.' }));
    },
  }));
};
