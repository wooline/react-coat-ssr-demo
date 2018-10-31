const request = require('request-promise-native');
const path = require('path');
const paths = require('./paths');

const appPackage = require(path.join(paths.rootPath, './package.json'));

const Module = module.constructor;

const config = {
  contentBase: paths.publicPath,
  watchContentBase: true,
  publicPath: '/',
  compress: true,
  historyApiFallback: !appPackage.devServer.ssr,
  hot: true,
  overlay: {
    warnings: true,
    errors: true,
  },
  stats: {
    colors: true,
  },
  // clientLogLevel: 'none',
  quiet: false,
  watchOptions: {
    ignored: /node_modules/,
  },
  before: (app) => {
    app.use((req, res, next) => {
      if (!appPackage.devServer.ssr || req.url === '/index.html' || req.url.startsWith('/server/') || req.url.startsWith('/client/')) {
        next();
      } else {
        Promise.all([request(`${req.protocol}://${req.headers.host}/server/main.js`), request(`${req.protocol}://${req.headers.host}/server/vendors.chunk.js`), request(`${req.protocol}://${req.headers.host}/index.html`)])
          .then(([main, vendors, tpl]) => {
            const mainModule = new Module();
            mainModule._compile(main, 'main.js');
            const vendorsModule = new Module();
            vendorsModule._compile(vendors, 'vendors.chunk.js');
            const vendorsModulePath = path.join(paths.rootPath, 'server/vendors.chunk.js');
            Module._cache[vendorsModulePath] = vendorsModule;
            const findPath = Module._findPath;
            Module._findPath = (...args) => {
              if (args[0] === './server/vendors.chunk.js') {
                return vendorsModulePath;
              }
              return findPath.apply(this, args);
            };

            return mainModule.exports.default(req.url).then((result) => {
              const { data, html } = result;
              res.send(tpl.replace('<!--{{html}}-->', html).replace('<!--{{store}}-->', `<script>window.reactCoatInitStore = ${JSON.stringify(data)};</script>`));
            });
          })
          .catch((err) => {
            console.log(err);
            if (err.code === '301' || err.code === '302') {
              res.redirect(parseInt(err.code, 10), err.detail);
            } else {
              res.send(err.message || '服务器错误！');
            }
          });
      }
    });
  },
};
module.exports = config;
