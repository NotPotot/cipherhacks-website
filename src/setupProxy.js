const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8787',
      changeOrigin: true,
    })
  );

  const mirageProxy = createProxyMiddleware({
    target: 'http://localhost:8787',
    changeOrigin: true,
    headers: { 'x-mirage-proxied': '1' },
  });

  app.use((req, res, next) => {
    if (req.headers['x-mirage-proxied']) return next();
    if (req.headers.upgrade === 'websocket') return next();
    if (req.url.startsWith('/ws') || req.url.includes('hot-update')) return next();
    mirageProxy(req, res, next);
  });
};
