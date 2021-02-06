const url = require('url');
const { listSvc, registerSvc, removeSvc } = require('../worker/worker.service');

async function router(req, res) {
  function respond(statusCode, message) {
    res.statusCode = statusCode || 200;
    res.write(message || '');
    res.end();
  }
  try {
    const uri = url.parse(req.url, true);
    switch (uri.pathname) {
      case '/register-worker':
        if (req.method === 'POST') {
          return registerSvc(req, res);
        } else {
          respond(404);
        }
        break;
      case '/list-worker':
        if (req.method === 'GET') {
          return listSvc(req, res);
        } else {
          respond(404);
        }
        break;
      case '/remove-worker':
        if (req.method === 'DELETE') {
          return removeSvc(req, res);
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
