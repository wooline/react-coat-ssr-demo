const devServer = require("react-coat-dev-utils/express-middleware/dev-server").default;
const devMock = require("react-coat-dev-utils/express-middleware/dev-mock").default;
const path = require("path");
const paths = require("./paths");

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
  proxy: appPackage.devServer.proxy,
  before: app => {
    app.use(devServer(appPackage.devServer.ssr, appPackage.devServer.proxy));
    app.use(devMock(appPackage.devServer.mock));
  },
};
module.exports = config;
