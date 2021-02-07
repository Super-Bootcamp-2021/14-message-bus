const { createServer } = require('http');
const url = require('url');
const { stdout } = require('process');
const {
  totalWorkerService,
  totalTaskService,
  totalDoneService,
  totalCancelService,
} = require('./peformance.service');

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
        case '/totalworker':
          if (req.method === 'GET') {
            return totalWorkerService(req, res);
          } else {
            respond(404);
          }
          break;
        case '/totaltask':
          if (req.method === 'GET') {
            return totalTaskService(req, res);
          } else {
            respond(404);
          }
          break;
        case '/totaldone':
          if (req.method === 'GET') {
            return totalDoneService(req, res);
          } else {
            respond(404);
          }
          break;
        case '/totalcancel':
          if (req.method === 'GET') {
            return totalCancelService(req, res);
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
  const PORT = 9009;
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
