const url = require('url');

const {
  attachmentService
} = require('../controllers/task.service');


function storageRoutes(req, res) {
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
    case /^\/photo\/\w+/.test(uri.pathname):
        if (method === 'GET') {
            photoService(req, res)
        } else {
            message = 'Method tidak tersedia'
            respond()
        }
      break
    case /^\/attachment\/\w+/.test(uri.pathname):
        if (method === 'GET') {
            attachmentService(req, res)
        } else {
            message = 'Method tidak tersedia'
            respond()
        }
      break
    default:
      message = 'Method tidak tersedia';
      statusCode = 404;
      respond();
  }
}

module.exports = storageRoutes;
