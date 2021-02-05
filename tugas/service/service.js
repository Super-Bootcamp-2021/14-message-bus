const { createServer } = require('http');
const url = require('url');
const { stdout } = require('process');
const {
  storeWorkerService,
  getWorkerService,
  getWorkerByIdService,
  deleteWorkerService,
} = require('./working-service');
const {
  storeTaskService,
  getTaskService,
  upTaskService,
  softDeleteTaskService
} = require('./task-service');
const { init } = require('../database/typeorm/main');
const { getConnection } = require('typeorm');


function initServer() {
  const server = createServer(async (req, res) => {
    const conn = getConnection().isConnected;
    if (!conn) {
      await init()
    }
    let method = req.method;
    // route service
    let message = 'tidak ditemukan data';
    let statusCode = 200;
    const uri = url.parse(req.url, true);
    const respond = () => {
      res.statusCode = statusCode;
      res.write(message);
      res.end();
    };
    switch (true) {
      case uri.pathname === '/store':
        if (method === 'POST') {
          storeWorkerService(req, res);
        } else {
          message = 'Method tidak tersedia';
          respond();
        }
        break;
      case uri.pathname === '/getallworker':
        if (method === 'GET') {
          getWorkerService(req, res);
        } else {
          message = 'Method tidak tersedia';
          respond();
        }
        break;
      case uri.pathname === '/find':
        if (method === 'GET') {
          getWorkerByIdService(req, res);
        } else {
          message = 'Method tidak tersedia';
          respond();
        }
        break;
      case uri.pathname === '/del':
        if (method === 'DELETE') {
          deleteWorkerService(req, res);
        } else {
          message = 'Method tidak tersedia';
          respond();
        }
        break;
      case uri.pathname === '/task':
        if (method === 'POST') {
          storeTaskService(req, res);
        } else {
          message = 'Method tidak tersedia';
          respond();
        }
        break;
      case uri.pathname === '/getalltask':
        if (method === 'GET') {
          getTaskService(req, res);
        } else {
          message = 'Method tidak tersedia';
          respond();
        }
        break;
      case uri.pathname === '/updatetask':
        if (method === 'PUT') {
          upTaskService(req, res);
        } else {
          message = 'Method tidak tersedia';
          respond();
        }
        break;
      case uri.pathname === '/deletetask':
        if (method === 'DELETE') {
          softDeleteTaskService(req, res);
        } else {
          message = 'Method tidak tersedia';
          respond();
        }
        break;
      default:
        statusCode = 404;
        respond();
    }
  });

  const PORT = 9999;
  server.listen(PORT, () => {
    stdout.write(`server listening on port ${PORT}\n`);
  });
}
module.exports = {
  initServer,
}