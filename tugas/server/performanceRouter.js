const url = require('url');
const { showWorkerPerformance } = require('../performance/performance.service');

async function router(req, res) {
  function respond(statusCode, message) {
    res.statusCode = statusCode || 200;
    res.write(message || '');
    res.end();
  }
  try {
    const uri = url.parse(req.url, true);
    switch (uri.pathname) {
      case '/performance':
        if (req.method === 'GET') {
          return showWorkerPerformance(req, res);
        } else {
          respond(404);
        }
        break;
      default:
        respond(404);
    }
  } catch (err) {
    respond(500, 'unkown server error');
  }
}

exports.router = router;
