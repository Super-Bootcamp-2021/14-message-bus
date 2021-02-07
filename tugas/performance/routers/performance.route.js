const url = require('url');
const {getSummary} = require('../controllers/performance.service')

function performanceRoutes(req, res) {
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
    case uri.pathname === '/summary':
      res.setHeader('content-type', 'application/json');
      if (method === 'GET') {
        getSummary(req, res);
      }
      break;
    default:
      message = 'Method tidak tersedia';
      statusCode = 404;
      respond();
  }
}

module.exports = performanceRoutes;
