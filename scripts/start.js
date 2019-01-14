const chalk = require("chalk");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const path = require("path");
const paths = require("../config/paths");
require("asset-require-hook")({
  extensions: ["jpg", "jpeg", "png", "gif"],
});

const appPackage = require(path.join(paths.rootPath, "./package.json"));

const webpackConfig = require(path.join(paths.configPath, "./webpack.config.dev"));
const devServerConfig = require(path.join(paths.configPath, "./webpackDevServer.config"));

const [, , port] = appPackage.devServer.url.split(/:\/*/);

webpackConfig[0].entry.unshift(`webpack-dev-server/client?http://0.0.0.0:${port}`, "webpack/hot/dev-server");

function clearConsole() {
  process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
}

const compiler = webpack(appPackage.devServer.ssr ? webpackConfig : webpackConfig[0]);

const devServer = new WebpackDevServer(compiler, devServerConfig);
devServer.listen(port, "0.0.0.0", error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  clearConsole();
  console.info(chalk`...starting {red development server} on {green ${appPackage.devServer.url}/} \n`);
  return null;
});
["SIGINT", "SIGTERM"].forEach(sig => {
  process.on(sig, () => {
    devServer.close();
    process.exit();
  });
});
