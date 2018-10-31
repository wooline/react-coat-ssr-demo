const express = require('express');
const main = require('./source/main');

const app = express();

app.get('*', (req, res) => {
  main
    .default(req.url)
    .then(data => res.send(JSON.stringify(data)))
    .catch((err) => {
      console.log(1, err);
      res.send('111');
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
