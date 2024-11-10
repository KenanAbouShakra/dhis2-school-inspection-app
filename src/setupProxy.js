const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api', // Ruten du vil proxy
        createProxyMiddleware({
            target: 'https://research.im.dhis2.org', 
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/in5320g19/api', 
            },
        })
    );
};
