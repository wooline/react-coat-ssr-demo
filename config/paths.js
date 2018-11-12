const path = require('path');

const rootPath = path.join(__dirname, '../');
const srcPath = path.join(rootPath, './src');
const configPath = path.join(rootPath, './config');
const scriptsPath = path.join(rootPath, './scripts');
const publicPath = path.join(rootPath, './public');
const distPath = path.join(rootPath, './build');
const distClientPath = path.join(distPath, './client');
const distServerPath = path.join(distPath, './server');
const sitePath = '/client/';

module.exports = {
  rootPath,
  srcPath,
  configPath,
  scriptsPath,
  publicPath,
  distPath,
  distClientPath,
  distServerPath,
  sitePath,
};
