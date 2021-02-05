const Busboy = require('busboy');
const url = require('url');
const { Writable } = require('stream');
const {
  registerTask,
  listTask,
  ERROR_DATA_TASK_MISSING,
  ERROR_TASK_NOT_FOUND,
  INFO_TASK_WORKER_WAS_SUBMITTED,
  ERROR_WORKER_ID_INVALID,
  ERROR_DATA_TASK_INVALID,
  updateStatusTask,
} = require('./task');
const { ERROR_WORKER_NOT_FOUND } = require('../workers/worker');
const { saveFile } = require('../lib/storage');
// eslint-disable-next-line no-unused-vars
const { IncomingMessage, ServerResponse } = require('http');

function registerTaskSvc(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  const data = {
    job: '',
    status: '',
    workerId: '',
    document: '',
  };

  let finished = false;

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      res.end();
    }
  }

  busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    switch (fieldname) {
      case 'document':
        try {
          data.document = await saveFile(file, mimetype);
        } catch (err) {
          abort();
        }
        if (finished) {
          try {
            const task = await registerTask(data);
            res.setHeader('content-type', 'application/json');
            res.write(JSON.stringify(task));
          } catch (err) {
            if (err === ERROR_DATA_TASK_MISSING) {
              res.statusCode = 401;
            } else {
              res.statusCode = 500;
            }
            res.write(err);
          }
          res.end();
        }
        break;
      default: {
        const noop = new Writable({
          write(chunk, encding, callback) {
            setImmediate(callback);
          },
        });
        file.pipe(noop);
      }
    }
  });

  busboy.on('field', (fieldname, val) => {
    if (['job', 'status', 'workerId'].includes(fieldname)) {
      data[fieldname] = val;
    }
  });

  busboy.on('finish', async () => {
    finished = true;
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

async function updateStatusTaskSvc(req, res) {
  const uri = url.parse(req.url, true);
  const data = {
    id: uri.query['id'],
    status: uri.query['status'],
  };
  if (!data.id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    const task = await updateStatusTask(data);
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.write(`${task} : Task was successfully UPDATED`);
    res.end();
  } catch (err) {
    if (err === ERROR_TASK_NOT_FOUND) {
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

async function listTaskSvc(req, res) {
  try {
    const tasks = await listTask();
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(tasks));
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

module.exports = {
  listTaskSvc,
  registerTaskSvc,
  updateStatusTaskSvc,
};
