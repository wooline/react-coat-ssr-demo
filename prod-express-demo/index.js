const express = require("express");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const devServer = require("react-coat-dev-utils/express-middleware/prod-demo").default;
const devMock = require("react-coat-dev-utils/express-middleware/dev-mock").default;

const paths = require(path.join(__dirname, "../config/paths"));
const appPackage = require(path.join(paths.rootPath, "./package.json"));
const mainModule = require(path.join(paths.distServerPath, "main"));
const htmlTpl = fs.readFileSync(path.join(paths.distClientPath, "index.html"), "utf8");
const [, , port] = appPackage.devServer.url.split(/:\/*/);
const app = express();
app.use("/client", express.static(paths.distClientPath, {fallthrough: false}));
app.use(devServer(htmlTpl, mainModule, appPackage.devServer.proxy));
app.use(devMock(appPackage.devServer.mock, appPackage.devServer.proxy, true));

app.listen(port, () => console.info(chalk`.....${new Date().toLocaleString()} starting {red SSR Server} on {green http://localhost:${port}/} \n`));
