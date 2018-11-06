const express = require('express');
const fs = require('fs');
const path = require('path');

const paths = require(path.join(__dirname, '../config/paths'));
const mainModule = require(path.join(paths.distServerPath, 'main'));

const htmlTpl = fs.readFileSync(path.join(paths.distClientPath, 'index.html'), 'utf8');

const app = express();
app.use('/client', express.static(paths.distClientPath));
app.get('*', (req, res) => {
  mainModule
    .default(req.url)
    .then((result) => {
      const { ssrInitStoreKey, data, html } = result;
      res.send(htmlTpl.replace(/<!--{react-coat-html}-->/, `${html}`).replace(/<!--{react-coat-script}-->/, `<script>window.${ssrInitStoreKey} = ${JSON.stringify(data)};</script>`));
    })
    .catch((err) => {
      console.log(err);
      if (err.code === '301' || err.code === '302') {
        res.redirect(parseInt(err.code, 10), err.detail);
      } else {
        res.send(err.message || '服务器错误！');
      }
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
