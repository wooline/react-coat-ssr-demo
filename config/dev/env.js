const path = require("path");
const paths = require("../paths");

const appPackage = require(path.join(paths.rootPath, "./package.json"));

module.exports = {
  clientPublicPath: "/client/",
  apiServerPath: {
    server: {"/ajax/": `${appPackage.devServer.url}/ajax/`},
    client: {"/ajax/": "/ajax/"},
  },
};
