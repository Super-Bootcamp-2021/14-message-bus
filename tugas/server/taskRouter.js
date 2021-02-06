const url = require('url');
const {
  createTsk,
  doneTsk,
  cancelTsk,
  listTsk,
  removeTsk,
} = require('../tasks/tasks.service');

async function router(req, res) {
  function respond(statusCode, message) {
    res.statusCode = statusCode || 200;
    res.write(message || '');
    res.end();
  }
  try {
    const uri = url.parse(req.url, true);
    switch (uri.pathname) {
      case '/create-task':
        if (req.method === 'POST') {
          return createTsk(req, res);
        } else {
          respond(404);
        }
        break;
      case '/done-task':
        if (req.method === 'GET') {
          return doneTsk(req, res);
        } else {
          respond(404);
        }
        break;
      case '/cancel-task':
        if (req.method === 'GET') {
          return cancelTsk(req, res);
        } else {
          respond(404);
        }
        break;
      case '/list-task':
        if (req.method === 'GET') {
          return listTsk(req, res);
        } else {
          respond(404);
        }
        break;
      case '/remove-task':
        if (req.method === 'DELETE') {
          return removeTsk(req, res);
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
