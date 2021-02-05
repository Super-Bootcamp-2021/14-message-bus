const url = require('url');
const {
  saveWorker,
  getWorker,
  deleteWorker,
  photoService,
} = require('../controllers/worker.service')

function workerRoutes(req, res) {
  req.params = {};

  let method = req.method;
  let message = 'tidak ditemukan data';
  let statusCode = 200;
  const uri = url.parse(req.url, true);

  const respond = async () => {
    res.setHeader('content-type', 'application/json');
    res.statusCode = statusCode;
    res.write(
      JSON.stringify({
        message,
      })
    );
    res.end();
  };

  switch (true) {
    case uri.pathname === '/worker':
      res.setHeader('content-type', 'application/json');
      if (method === 'GET') {
        getWorker(req, res); 
      } else if (method === 'POST') {
        saveWorker(req, res);
      } else {
        message = 'Method tidak tersedia';
        statusCode = 404;
        respond();
      }
      break;
    case /worker*/.test(uri.pathname):
      res.setHeader('content-type', 'application/json');
      req.params.id = uri.pathname.split('/')[2];
      if (method === 'DELETE') {
        deleteWorker(req,res);
        break;
      }
    break
    default:
      message = 'Method tidak tersedia';
      statusCode = 404;
      respond();
  }
}

module.exports = workerRoutes;
