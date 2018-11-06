const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
const paths = require('../config/paths');
require('asset-require-hook')({
  extensions: ['jpg', 'jpeg', 'png', 'gif'],
});

const appPackage = require(path.join(paths.rootPath, './package.json'));

const webpackConfig = require(path.join(paths.configPath, './webpack.config.dev'));
const devServerConfig = require(path.join(paths.configPath, './webpackDevServer.config'));
// const formatWebpackMessages = require('./formatWebpackMessages');

const port = appPackage.devServer.port || 7443;
webpackConfig[0].entry.unshift(`webpack-dev-server/client?http://0.0.0.0:${port}`, 'webpack/hot/dev-server');

function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}

const compiler = webpack(appPackage.devServer.ssr ? webpackConfig : webpackConfig[0]);

// compiler.hooks.invalid.tap('invalid', () => {
//   clearConsole();
//   console.log('Compiling...');
// });

// compiler.hooks.done.tap('done', (stats) => {
//   clearConsole();
//   const messages = formatWebpackMessages(stats.toJson({ all: false, warnings: true, errors: true }));
//   const isSuccessful = !messages.errors.length && !messages.warnings.length;
//   if (isSuccessful) {
//     console.log(chalk.green('Compiled successfully!'));
//     console.log(chalk.blue(`starting dev server on http://localhost:${port}/`));
//   }
//   // If errors exist, only show errors.
//   if (messages.errors.length) {
//     // Only keep the first error. Others are often indicative
//     // of the same problem, but confuse the reader with noise.
//     if (messages.errors.length > 1) {
//       messages.errors.length = 1;
//     }
//     console.log(chalk.red('Failed to compile.\n'));
//     console.log(messages.errors.join('\n\n'));
//     return;
//   }
//   // Show warnings if no errors were found.
//   if (messages.warnings.length) {
//     console.log(chalk.yellow('Compiled with warnings.\n'));
//     console.log(messages.warnings.join('\n\n'));

//     // Teach some ESLint tricks.
//     console.log(`\nSearch for the ${chalk.underline(chalk.yellow('keywords'))} to learn more about each warning.`);
//     console.log(`To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.\n`);
//   }
// });

const devServer = new WebpackDevServer(compiler, devServerConfig);
devServer.listen(port, '0.0.0.0', (error) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  clearConsole();
  console.log(chalk.cyan('Starting the development server...\n'));
  return null;
});
['SIGINT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => {
    devServer.close();
    process.exit();
  });
});
