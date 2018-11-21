const webpack = require("webpack");
const path = require("path");
const fs = require("fs-extra");
const paths = require("../config/paths");
require("asset-require-hook")({
  extensions: ["jpg", "jpeg", "png", "gif"],
});

const appPackage = require(path.join(paths.rootPath, "./package.json"));

const webpackConfig = require(path.join(paths.configPath, "./webpack.config.prod"));

const compiler = webpack(appPackage.devServer.ssr ? webpackConfig : webpackConfig[0]);

fs.emptyDirSync(paths.distClientPath);
fs.emptyDirSync(paths.distServerPath);
fs.copySync(paths.publicPath, paths.distPath, {dereference: true});

compiler.run((error, stats) => {
  if (error) {
    console.error(error.stack || error);
    if (error.details) {
      console.error(error.details);
    }
    process.exit(1);
  } else {
    console.log(
      stats.toString({
        entrypoints: false,
        colors: true,
        modules: false,
        excludeAssets: /\.(?!js|html)\w+$/,
      })
    );
    if (stats.hasErrors() || stats.hasWarnings()) {
      process.exit(1);
    } else {
      fs.removeSync(path.join(paths.distServerPath, "media"));
    }
  }
});
