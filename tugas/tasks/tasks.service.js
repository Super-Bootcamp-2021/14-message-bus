const Busboy = require('busboy');
const url = require('url');
const { Writable } = require('stream');
const {
  writeDataTask,
  doneDataTask,
  cancelDataTask,
  readTask,
  removeTask,
  ERROR_REGISTER_DATA_INVALID,
  ERROR_DATA_NOT_FOUND,
} = require('../lib/orm');
const { saveFile, randomFileName } = require('../lib/storage');

async function write(res, data) {
  try {
    await writeDataTask(data);
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(data));
  } catch (err) {
    if (err === ERROR_REGISTER_DATA_INVALID) {
      res.statusCode = 401;
    } else {
      res.statusCode = 500;
    }
    res.write(err);
  }
  res.end();
}

function createTsk(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  const data = {
    job: '',
    assigneeId: 0,
    attachment: '',
    done: false,
    cancel: false,
  };

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      res.end();
    }
  }

  busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    switch (fieldname) {
      case 'attachment':
        try {
          const fileName = randomFileName(mimetype);
          await saveFile(file, mimetype, 'file', fileName);
          data.attachment = fileName;
        } catch (err) {
          abort();
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
    if (
      ['job', 'assigneeId', 'attachment', 'done', 'cancel'].includes(fieldname)
    ) {
      data[fieldname] = val;
      console.log(data);
    }
  });

  busboy.on('finish', async () => {
    await write(res, data);
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

async function doneTsk(req, res) {
  const uri = url.parse(req.url, true);
  console.log(uri);
  const id = uri.query['id'];
  console.log(id);
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    const tasks = await doneDataTask(id);
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.write(JSON.stringify(tasks));
    res.end();
  } catch (err) {
    if (err === ERROR_DATA_NOT_FOUND) {
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

async function cancelTsk(req, res) {
  const uri = url.parse(req.url, true);
  console.log(uri);
  const id = uri.query['id'];
  console.log(id);
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    const tasks = await cancelDataTask(id);
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.write(JSON.stringify(tasks));
    res.end();
  } catch (err) {
    if (err === ERROR_DATA_NOT_FOUND) {
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

async function listTsk(req, res) {
  try {
    const tasks = await readTask();
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(tasks));
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

async function removeTsk(req, res) {
  const uri = url.parse(req.url, true);
  const id = uri.query['id'];
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    const worker = await removeTask(id);
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.write(JSON.stringify(worker));
    res.end();
  } catch (err) {
    if (err === ERROR_DATA_NOT_FOUND) {
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

module.exports = {
  createTsk,
  doneTsk,
  cancelTsk,
  listTsk,
  removeTsk,
};
