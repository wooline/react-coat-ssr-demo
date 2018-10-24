const request = require('request');
const paths = require('./paths');

const config = {
  contentBase: paths.publicPath,
  watchContentBase: true,
  publicPath: '/',
  compress: true,
  historyApiFallback: false,
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
  before: (app) => {
    app.use((req, res, next) => {
      if (req.url.startsWith('/server/') || req.url.startsWith('/client/')) {
        next();
      } else {
        request(`${req.protocol}://${req.headers.host}/server/js/main.js`, (error, response, body) => {
          if (body) {
            res.send(body);
          } else {
            res.send(error.toString());
          }
        });
      }
    });
  },
};
module.exports = config;
