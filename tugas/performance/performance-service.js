const {
  readTaskAdded,
  readWorkerAdded,
  readTaskCancelled,
  readTaskDone,
} = require('./performance');

async function readTaskAddedService(req, res) {
  const data = await readTaskAdded();
  res.setHeader('Content-Type', 'application/json');
  res.write(data);
  res.statusCode = 200;
  res.end();
}

async function readTaskDoneService(req, res) {
  const data = await readTaskDone();
  res.setHeader('Content-Type', 'application/json');
  res.write(data);
  res.statusCode = 200;
  res.end();
}

async function readTaskCancelledService(req, res) {
  const data = await readTaskCancelled();
  res.setHeader('Content-Type', 'application/json');
  res.write(data);
  res.statusCode = 200;
  res.end();
}

async function readWorkerAddedService(req, res) {
  const data = await readWorkerAdded();
  res.setHeader('Content-Type', 'application/json');
  res.write(data);
  res.statusCode = 200;
  res.end();
}

module.exports = {
  readTaskAddedService,
  readTaskCancelledService,
  readTaskDoneService,
  readWorkerAddedService,
};
