const paths = require('./paths');

const config = {
  contentBase: paths.publicPath,
  watchContentBase: true,
  publicPath: '/',
  compress: true,
  historyApiFallback: true,
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
};
module.exports = config;
