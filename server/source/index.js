const server = require('./main');

server
  .default('/photos')
  .then(data => console.log(JSON.stringify(data)))
  .catch(err => console.log(err));
