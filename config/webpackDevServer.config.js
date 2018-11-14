const path = require("path");
const paths = require("./paths");

const middleware = require(path.join(paths.scriptsPath, "./middleware/dev-server")).default;

const appPackage = require(path.join(paths.rootPath, "./package.json"));

const config = {
  contentBase: paths.publicPath,
  watchContentBase: true,
  publicPath: "/",
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
  quiet: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  before: app => {
    app.use(middleware(appPackage.devServer.ssr));
  },
};
module.exports = config;
