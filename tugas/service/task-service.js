const Busboy = require('busboy');
const url = require('url');
const { register, taskSelesai, taskBatal, ERROR_REGISTER_DATA_INVALID, list, ERROR_WORKER_NOT_FOUND,
  ERROR_TASK_NOT_FOUND } = require('./task-logic');
const { upload } = require('../database/typeorm/storage');
const { loggingMsg } = require('./performance-service')

function storeTaskService(req, res) {
  const busboy = new Busboy({ headers: req.headers });
  res.setHeader('content-type', 'application/json');
  const data = {
    job: '',
    detail: '',
    attach: '',
    assignee: '',
  };

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      loggingMsg('totalTasks', res.statusCode);
      res.end();
    }
  }

  busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    switch (fieldname) {
      case 'attach':
        upload(data, fieldname, file, mimetype, abort);
    }
  });

  busboy.on('field', (fieldname, val) => {
    if (['job', 'detail', 'attach', 'assignee'].includes(fieldname)) {
      data[fieldname] = val;
    }
  });

  busboy.on('finish', async () => {
    try {
      const task = await register(data);
      await res.write(JSON.stringify(task));
      loggingMsg('totalTasks', res.statusCode);
      await res.end();
    } catch (err) {
      if (err === ERROR_REGISTER_DATA_INVALID) {
        res.statusCode = 401;
      } else if (err === ERROR_WORKER_NOT_FOUND) {
        res.statusCode = 204;
      }else {
        res.statusCode = 500;
      }
      await res.write(err);
      loggingMsg('totalTasks', res.statusCode);
      await res.end();
    }
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

async function upTaskService(req, res) {
  const uri = url.parse(req.url, true);
  const id = uri.query['id'];
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    loggingMsg('finish', res.statusCode);
    res.end();
    return;
  }
  try {
    await taskSelesai(id);
    res.statusCode = 200;
    res.write(`Update ID dengan ${id}`);
    loggingMsg('finish', res.statusCode);
    res.end();
  } catch (err) {
    if (err === ERROR_TASK_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      loggingMsg('finish', res.statusCode);
      res.end();
      return;
    }
    res.statusCode = 500;
    loggingMsg('finish', res.statusCode);
    res.end();
    return;
  }
}

async function softDeleteTaskService(req, res) {
  const uri = url.parse(req.url, true);
  const id = uri.query['id'];
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    loggingMsg('cancel', res.statusCode);
    res.end();
    return;
  }
  try {
    await taskBatal(id);
    res.statusCode = 200;
    res.write(`batalkan task dengan ${id}`);
    loggingMsg('cancel', res.statusCode);
    res.end();
  } catch (err) {
    if (err === ERROR_TASK_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      loggingMsg('cancel', res.statusCode);
      res.end();
      return;
    }
    res.statusCode = 500;
    loggingMsg('cancel', res.statusCode);
    res.end();
    return;
  }
}


async function getTaskService(req, res) {
  const value = await list();
  res.setHeader('Content-Type', 'application/json');
  const data = JSON.stringify(value);
  res.statusCode = 200;
  res.write(data);
  res.end();
}


module.exports = {
  storeTaskService,
  getTaskService,
  upTaskService,
  softDeleteTaskService
};
