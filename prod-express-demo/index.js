const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const paths = require(path.join(__dirname, '../config/paths'));
const appPackage = require(path.join(paths.rootPath, './package.json'));
const port = appPackage.devServer.port || 7443;
const mainModule = require(path.join(paths.distServerPath, 'main'));

const htmlTpl = fs.readFileSync(path.join(paths.distClientPath, 'index.html'), 'utf8');
const htmlChunks = htmlTpl.split('<!--{react-coat-response-chunk}-->');

const app = express();
app.use('/client', express.static(paths.distClientPath));
app.get('*', (req, res) => {
  if (htmlChunks[1]) {
    res.write(htmlChunks[0]);
  }
  mainModule
    .default(req.url)
    .then((result) => {
      const { ssrInitStoreKey, data, html } = result;
      if (res.headersSent) {
        res.write(htmlChunks[1].replace(/[^>]*<!--{react-coat-html}-->[^<]*/m, `${html}`).replace(/<!--{react-coat-script}-->/, `<script>window.${ssrInitStoreKey} = ${JSON.stringify(data)};</script>`));
        res.end();
      } else {
        res.send(htmlChunks[0].replace(/[^>]*<!--{react-coat-html}-->[^<]*/m, `${html}`).replace(/<!--{react-coat-script}-->/, `<script>window.${ssrInitStoreKey} = ${JSON.stringify(data)};</script>`));
      }
    })
    .catch((err) => {
      if (err.code === '301' || err.code === '302') {
        if (res.headersSent) {
          res.write(`<a data-type="${parseInt(err.code, 10)}" href="${err.detail}">跳转中。。。</a></body><script>window.location.href="${err.detail}"</script></html>`);
          res.end();
        } else {
          res.redirect(parseInt(err.code, 10), err.detail);
        }
      } else {
        console.log(err);
        if (res.headersSent) {
          res.write(`${err.message || '服务器错误！'}</body></html>`);
        } else {
          res.send(err.message || '服务器错误！');
        }
      }
    });
});

app.listen(port, () => console.info(chalk`.....${new Date().toLocaleString()} starting {red SSR Server} on {green http://localhost:${port}/} \n`));
