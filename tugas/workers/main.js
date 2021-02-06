const { createServer } = require('http');
const url = require('url');

const { stdout } = require('process');
const {
  uploadService,
  readService,
  deleteService,
} = require('../object-storage/storage-service');

const { createWorker } = require('./worker-service');

const server = createServer(async (req, res) => {
  let method = req.method;

  let message = '404 not found';
  let statusCode = 200;

  const respond = () => {
    res.statusCode = statusCode;
    res.write(message);
    res.end();
  };

  const uri = url.parse(req.url, true);

  switch (true) {
    case /^\/create\/worker/.test(uri.pathname):
      if (method === 'POST') {
        let data = {};

        createWorker(req, res).then((result) => {
          data = result;
        });

        uploadService(req, res)
          .then((result) => {
            data['attachment'] = result;
          })
          .then(() => {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(data));
            res.end();
          });
      } else {
        respond();
      }
      break;

    case /^\/update\/worker/.test(uri.pathname):
      if (method === 'GET') {
        let data = {
          id: 20,
          nama: 'junior',
          email: 'junior@mail.com',
          telepon: '097848',
          alamat: 'bangkalan',
          biografi: 'ini biografi',
        };
        message = 'await updateWorker(data)';
      } else {
        respond();
      }
      break;

    case /^\/read\/worker/.test(uri.pathname):
      if (method === 'GET') {
        message = 'await readWorker()';
        res.setHeader('Content-Type', 'application/json');
      } else {
        respond();
      }
      break;

    case /^\/delete\/worker/.test(uri.pathname):
      if (method === 'GET') {
        message = "await deleteWorker(uri.query['id'])";
      } else {
        message = 'Method tidak tersedia';
      }
      break;

    default:
      statusCode = 404;
      respond();
      break;
  }
});

const PORT = 7000;
server.listen(PORT, () => {
  stdout.write(`server listening on port ${PORT}`);
});
