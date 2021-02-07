const { createServer } = require('http');
const url = require('url');
const { stdout } = require('process');
const {
  taskSvc,
  listTaskSvc,
  listTaskCancelSvc,
  listTaskDoneSvc,
  dropListSvc,
  workerSvc
} = require('./performance.service');

let server;

function run() {
  server = createServer((req, res) => {
    function respond(statusCode, message) {
      res.statusCode = statusCode || 200;
      res.write(message || '');
      res.end();
      return;
    }

    const uri = url.parse(req.url, true);
    switch (uri.pathname) {
      case '/task':
        if (req.method === 'GET') {
          return taskSvc(req, res);
        } else {
          respond(404);
        }
        break;
      case '/worker':
        if (req.method === 'GET') {
          return workerSvc(req, res);
        } else {
          respond(404);
        }
        break;
      case '/task/created':
        if (req.method === 'GET') {
          return listTaskSvc(req, res);
        } else {
          respond(404);
        }
        break;
      case '/task/done':
        if (req.method === 'GET') {
          return listTaskDoneSvc(req, res);
        } else {
          respond(404);
        }
        break;
      case '/task/cancel':
        if (req.method === 'GET') {
          return listTaskCancelSvc(req, res);
        } else {
          respond(404);
        }
        break;
      case '/drop':
        if (req.method === 'GET') {
          return dropListSvc(req, res);
        } else {
          respond(404);
        }
        break;

      default:
        respond(404);
    }
  });

  const PORT = 3232;
  server.listen(PORT, () => {
    stdout.write(`server performance service listening on port ${PORT}\n`);
  });
}

// const redis = require('../lib/kv');
// async function perf() {
//   try {
//     console.log('connect to redis service...');
//     await redis.connect();
//     console.log('redis connected');
//   } catch (err) {
//     console.error('redis connection failed');
//     return;
//   }

//   console.log('running service...');
//   run();
// }

// perf();

module.exports = {
  run,
};
