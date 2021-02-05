const url = require('url');
const {
  read,
  create,
  delete: deleteTask,
  completed,
} = require('../controllers/task.service');

function taskRoutes(req, res) {
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
    case uri.pathname === '/task':
      res.setHeader('content-type', 'application/json');
      if (method === 'GET') {
        message = 'GET TASK';
        read(req, res);
      } else if (method === 'POST') {
        message = 'POST TASK';
        create(req, res);
      } else {
        message = 'Method tidak tersedia';
        statusCode = 404;
        respond();
      }
      break;
    case /task*/.test(uri.pathname):
      res.setHeader('content-type', 'application/json');
      req.params.id = uri.pathname.split('/')[2];
      if (method === 'DELETE') {
        deleteTask(req, res);
        break;
      } else if (method === 'PUT') {
        completed(req, res);
        break;
      }
    default:
      message = 'Method tidak tersedia';
      statusCode = 404;
      respond();
  }
}

module.exports = taskRoutes;
