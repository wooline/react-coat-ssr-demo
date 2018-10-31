const webpack = require('webpack');
const path = require('path');
const fs = require('fs-extra');
const paths = require('../config/paths');

const appPackage = require(path.join(paths.rootPath, './package.json'));

const webpackConfig = require(path.join(paths.configPath, './webpack.config.prod'));

const compiler = webpack(appPackage.devServer.ssr ? webpackConfig : webpackConfig[0]);

fs.emptyDirSync(paths.distPath);
fs.copySync(paths.publicPath, paths.distPath, { dereference: true });

compiler.run((error, stats) => {
  if (error) {
    console.error(error.stack || error);
    if (error.details) {
      console.error(error.details);
    }
    process.exit(1);
  } else {
    console.log(stats.toString({ chunks: false, colors: true }));
    /* if (env.profile) {
            console.info(chalk`{green.bold [task]} write stats.json`);
            fs.writeFileSync("stats.json", JSON.stringify(stats.toJson({}), null, 2));
        } */
    if (stats.hasErrors() || stats.hasWarnings()) {
      process.exit(1);
    }
  }
});
