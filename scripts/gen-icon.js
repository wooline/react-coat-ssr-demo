const chalk = require("chalk");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const yargs = require("yargs");
const https = require("https");
const childProcess = require("child_process");
const paths = require("../config/paths");

const htmlBoilerplatePath = path.join(paths.scriptsPath, "./icon-boilerplate/icon.html");
const lessBoilerplatePath = path.join(paths.scriptsPath, "./icon-boilerplate/iconfont.less");
const componentBoilerplatePath = path.join(paths.scriptsPath, "./icon-boilerplate/IconComponent.tsx");

const cssPath = path.join(paths.srcPath, "./asset/css/iconfont.less");
const assetFolderPath = path.join(paths.srcPath, "./asset/font");
const componentPath = path.join(paths.srcPath, "./components/Icon.tsx");
const htmlPath = path.resolve(paths.publicPath, "./client/icon.html");

function classNameToEnum(className) {
  if (!/^icon-[a-zA-Z](.*)$/.test(className)) {
    throw new Error(`${className} does not conform to naming convention`);
  }

  return className
    .substring(5)
    .replace(/-/g, "_")
    .toUpperCase();
}

async function getContent(url) {
  if (url.startsWith("//")) {
    url = `http:${url}`;
  }
  const response = await axios.get(url, {httpsAgent: new https.Agent({rejectUnauthorized: false})});
  return response.data;
}

function getExtension(url) {
  let extension = url.substr(url.lastIndexOf(".") + 1);
  const questionMarkIndex = extension.indexOf("?");
  if (questionMarkIndex > 0) extension = extension.substr(0, questionMarkIndex);
  return extension.toLowerCase();
}

async function downloadFontAsset(url, fileName) {
  if (!fs.existsSync(assetFolderPath)) {
    fs.mkdirSync(assetFolderPath);
  }
  const content = await getContent(url);
  fs.writeFileSync(`${assetFolderPath}/${fileName}`, content);
}

function transformToLocalURL(url) {
  if (url.startsWith("data:application/x-font-woff;")) {
    return `url("${url}") format("woff")`;
  }
  const assetExtension = getExtension(url);
  if (assetExtension === "ttf") {
    downloadFontAsset(url, "iconfont.ttf");
    return 'url("../font/iconfont.ttf") format("truetype")';
  }
  if (assetExtension === "woff") {
    downloadFontAsset(url, "iconfont.woff");
    return 'url("../font/iconfont.woff") format("woff")';
  }
  return null;
}

function analyzeCSS(content) {
  // Process URLs (assets)
  const assetURLs = content.match(/url\('(.|\n)*?'\)/g).map(_ => _.substring(5, _.length - 2));
  let lessContent = fs
    .readFileSync(lessBoilerplatePath)
    .toString()
    .replace(
      '"{1}"',
      assetURLs
        .map(url => transformToLocalURL(url))
        .filter(_ => _)
        .join(",")
    );
  lessContent = lessContent.replace("/* {2} */", content.match(/\.icon-(.*?)\}/g).join("\n"));
  fs.writeFileSync(cssPath, lessContent);

  // Process icon items
  const classList = content.match(/\.icon-(.*):before/g).map(_ => _.substr(1).replace(":before", ""));
  const componentContent = fs
    .readFileSync(componentBoilerplatePath)
    .toString()
    .replace("/* {1} */", classList.map(_ => `${classNameToEnum(_)} = "${_}",`).join("\n"));
  fs.writeFileSync(componentPath, componentContent);

  return classList;
}

function generatePreviewHtml(iconList, cssURL) {
  const icons = iconList.map(_ => `<div class="item"><i class="iconfont ${_}"></i><span>${classNameToEnum(_)}</span></div>`);
  fs.writeFileSync(
    htmlPath,
    fs
      .readFileSync(htmlBoilerplatePath)
      .toString()
      .replace("{1}", cssURL)
      .replace("{2}", icons.join(""))
      .replace("{3}", new Date().toLocaleString())
  );
}

function spawn(command, args) {
  const isWindows = process.platform === "win32";
  const result = childProcess.spawnSync(isWindows ? `${command}.cmd` : command, args, {stdio: "inherit"});
  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${args.join(" ")}`);
    process.exit(1);
  }
}

async function generate() {
  console.info(chalk`{white.bold usage:} 🎈 yarn icon \{icon-font-css-url\}`);
  const cssURL = yargs.argv._[0];

  try {
    if (!cssURL) throw new Error("Missing CSS URL in command line");

    const cssContent = await getContent(cssURL);
    const iconClassList = analyzeCSS(cssContent);
    console.info(chalk`{white.bold 😍 Generated ${iconClassList.length} icons}`);

    generatePreviewHtml(iconClassList, cssURL);
    console.info(chalk`{white.bold 😍 Generated HTML for preview}`);

    spawn("prettier", ["--config", ".prettierrc.json", "--write", "src/asset/css/iconfont.less"]);
    spawn("prettier", ["--config", ".prettierrc.json", "--write", "src/components/Icon.tsx"]);
    console.info(chalk`{white.bold 💕 Format generated files}`);
  } catch (e) {
    console.error(chalk`{red.bold ❌ Error: ${e.message}}`);
    process.exit(1);
  }
}

generate();
