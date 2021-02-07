const {
  taskLog,
  listTask,
  listTaskCancel,
  listTaskDone,
  dropList,
  ERROR_KEY_NOT_FOUND,
  workerLog
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

async function dropListSvc(req, res) {
  const uri = url.parse(req.url, true);
  const key = uri.query['key'];
  if (!key) {
    res.statusCode = 401;
    res.write('parameter key tidak ditemukan');
    res.end();
    return;
  }

  try {
    const result = await dropList(key);
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(result));
    res.end();
  } catch (err) {
    if (err === ERROR_KEY_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      res.end();
      return;
    }
    res.statusCode = 500;
    res.end();
    return;
  }
}

async function workerSvc(req, res) {
  const uri = url.parse(req.url, true);
  const data = uri.query['data'];
  const workerLogs = await workerLog(data);
  res.setHeader('content-type', 'application/json');
  res.write(JSON.stringify(workerLogs));
  res.end();
}

module.exports = {
  taskSvc,
  listTaskSvc,
  listTaskDoneSvc,
  listTaskCancelSvc,
  dropListSvc,
  workerSvc
};
