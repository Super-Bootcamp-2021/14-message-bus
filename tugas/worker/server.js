const { createServer } = require('http');
const url = require('url');
const { stdout } = require('process');
const { listService, registerService, removeService } = require('./worker.service');

let server;

/**
 * run server
 */
function run() {
  server = createServer((req, res) => {
    /**
     * write http response message
     */
    function respond(statusCode, message) {
      res.statusCode = statusCode || 200;
      res.write(message || '');
      res.end();
    }

    try {
      const uri = url.parse(req.url, true);
      switch (uri.pathname) {
        case '/register':
          if (req.method === 'POST') {
            return registerService(req, res);
          } else {
            respond(404);
          }
          break;
        case '/list':
          if (req.method === 'GET') {
            return listService(req, res);
          } else {
            respond(404);
          }
          break;
        case '/remove':
          if (req.method === 'DELETE') {
            return removeService(req, res);
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
