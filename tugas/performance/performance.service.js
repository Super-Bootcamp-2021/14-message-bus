const {
  taskLog,
  listTask,
  listTaskCancel,
  listTaskDone,
} = require('./performance');
const url = require('url');

async function taskSvc(req, res) {
  const uri = url.parse(req.url, true);
  const data = uri.query['data'];
  const taskLogs = await taskLog(data);
  res.setHeader('content-type', 'application/json');
  res.write(JSON.stringify(taskLogs));
  res.end();
}

async function listTaskSvc(req, res) {
  const data = await listTask();
  res.setHeader('content-type', 'application/json');
  res.write(JSON.stringify(data));
  res.end();
}

async function listTaskDoneSvc(req, res) {
  const data = await listTaskDone();
  res.setHeader('content-type', 'application/json');
  res.write(JSON.stringify(data));
  res.end();
}

async function listTaskCancelSvc(req, res) {
  const data = await listTaskCancel();
  res.setHeader('content-type', 'application/json');
  res.write(JSON.stringify(data));
  res.end();
}

module.exports = {
  taskSvc,
  listTaskSvc,
  listTaskDoneSvc,
  listTaskCancelSvc,
};
