Object.defineProperty(exports, "__esModule", {value: true});
const axios = require("axios");

const Module = module.constructor;
function middleware(ssr) {
  return (req, res, next) => {
    const passUrls = ["^/index.html", "^/server/", "^/client/", "^/sockjs-node/", "^/[^/]+\\.hot-update\\.[^/]+$"];
    if (!ssr || passUrls.some(reg => new RegExp(reg).test(req.url))) {
      next();
    } else {
      Promise.all([axios.get(`${req.protocol}://${req.headers.host}/server/main.js`), axios.get(`${req.protocol}://${req.headers.host}/index.html`)])
        .then(([main, tpl]) => {
          const htmlChunks = tpl.data.split(/<!--\s*{react-coat-response-chunk}\s*-->/);
          if (htmlChunks[1]) {
            res.write(htmlChunks[0]);
          }
          const mainModule = new Module();
          mainModule._compile(main.data, "main.js");
          return mainModule.exports.default(req.url).then(result => {
            const {ssrInitStoreKey, data, html} = result;
            if (res.headersSent) {
              res.write(
                htmlChunks[1]
                  .replace(/[^>]*<!--\s*{react-coat-html}\s*-->[^<]*/m, `${html}`)
                  .replace(/<!--\s*{react-coat-script}\s*-->/, `<script>window.${ssrInitStoreKey} = ${JSON.stringify(data)};</script>`)
              );
              res.end();
            } else {
              res.send(
                htmlChunks[0]
                  .replace(/[^>]*<!--\s*{react-coat-html}\s*-->[^<]*/m, `${html}`)
                  .replace(/<!--\s*{react-coat-script}\s*-->/, `<script>window.${ssrInitStoreKey} = ${JSON.stringify(data)};</script>`)
              );
            }
          });
        })
        .catch(err => {
          if (err.code === "301" || err.code === "302") {
            if (res.headersSent) {
              res.write(`<a data-type="${parseInt(err.code, 10)}" href="${err.detail}">跳转中。。。</a></body><script>window.location.href="${err.detail}"</script></html>`);
              res.end();
            } else {
              res.redirect(parseInt(err.code, 10), err.detail);
            }
          } else {
            console.log(err);
            if (res.headersSent) {
              res.write(`${err.message || "服务器错误！"}</body></html>`);
            } else {
              res.send(err.message || "服务器错误！");
            }
          }
        });
    }
  };
}
exports.default = middleware;
