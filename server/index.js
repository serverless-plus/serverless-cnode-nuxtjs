const { join } = require('path');
const { loadNuxt, build } = require('nuxt');
const Express = require('express');
const Cache = require('./cache');

const isDev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 8000;

function getCacheKey(req) {
  return `${req.url}`;
}

async function cacheRender(app, req, res) {
  const key = getCacheKey(req);

  if (Cache.has(key)) {
    res.setHeader('X-Cache', 'HIT');
    res.send(Cache.get(key));
    return;
  }

  const { html, error, redirected } = await app.renderRoute(req.url, {req, res});
  if (error) {
    res.send(html);
    return;
  }
  Cache.set(key, html);
  res.setHeader('X-Cache', 'MISS');
  res.send(html);
}

// not report route for custom monitor
const noReportRoutes = ['/_nuxt', '/favicon.ico'];

async function startServer() {
  const app = await loadNuxt(isDev ? 'dev' : 'start');
  const server = Express();

  server.use(Express.static(join(__dirname, '../static')));

  if (isDev) {
    build(app);
  }

  // only cache index
  server.get('/', (req, res) => {
    return cacheRender(app, req, res);
  });
  server.get('/all', (req, res) => {
    return cacheRender(app, req, res);
  });
  server.get('/about', (req, res) => {
    return cacheRender(app, req, res);
  });

  server.get('*', (req, res) => {
    noReportRoutes.forEach((route) => {
      if (req.path.indexOf(route) === 0) {
        req['__SLS_NO_REPORT__'] = true;
      }
    });
    return app.render(req, res);
  });

  // define binary type for response
  // if includes, will return base64 encoded, very useful for images
  server['binaryTypes'] = ['*/*'];

  return server;
}

if (process.env.SERVERLESS) {
  module.exports = startServer;
} else {
  try {
    startServer().then((server) => {
      server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
      });
    });
  } catch (e) {
    throw e;
  }
}

process.on('unhandledRejection', (e) => {
  throw e;
});
