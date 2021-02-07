const { createServer } = require('http');
const { stdout } = require('process');
const url = require('url');
const { readService, uploadService, deleteService } = require('./storage-service');

const server = createServer(async (req, res) => {
  let method = req.method;
  // route service
  let message = '404 not found';
  let statusCode = 200;
  const uri = url.parse(req.url, true);
  const respond = () => {
    res.statusCode = statusCode;
    res.write(message);
    res.end();
  };
  switch (true) {
    case uri.pathname === '/store':
      if (method === 'POST') {
        uploadService(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
    case /^\/read\/\w+/.test(uri.pathname):
      if (method === 'GET') {
        await readService(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
    case /^\/delete\/\w+/.test(uri.pathname):
      if (method === 'GET') {
        await deleteService(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
    default:
      statusCode = 404;
      respond();
  }
});

const PORT = 5454;
server.listen(PORT, () => {
  stdout.write(`server listening on port ${PORT}`);
});
