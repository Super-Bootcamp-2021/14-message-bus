const { createServer } = require('http');
const url = require('url');
const { stdout } = require('process');
const {
  registerTaskSvc,
  listTaskSvc,
  updateStatusTaskSvc,
} = require('./task.service');

let server;

/**
 * run server
 */
function run() {
  server = createServer((req, res) => {
    function respond(statusCode, message) {
      res.statusCode = statusCode || 200;
      res.write(message || '');
      res.end();
    }

    // route service based on its pathname
    try {
      const uri = url.parse(req.url, true);
      switch (uri.pathname) {
        case '/tasks/add':
          if (req.method === 'POST') {
            return registerTaskSvc(req, res);
          } else {
            respond(404);
          }
          break;
        case '/tasks/update/status':
          if (req.method === 'POST') {
            return updateStatusTaskSvc(req, res);
          } else {
            respond(404);
          }
          break;
        case '/tasks/list':
          if (req.method === 'GET') {
            return listTaskSvc(req, res);
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
  });

  // run server
  const PORT = 9999;
  server.listen(PORT, () => {
    stdout.write(`🚀 server listening on port ${PORT}\n`);
  });
}

/**
 * stop server
 */
function stop() {
  if (server) {
    server.close();
  }
}

module.exports = {
  run,
  stop,
};
