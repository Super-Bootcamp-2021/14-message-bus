const Busboy = require('busboy');
const url = require('url');
const { Writable } = require('stream');
const { performanceTotalWorker } = require('../message-bus/client');
const {
  writeData,
  readData,
  removeData,
  ERROR_REGISTER_DATA_INVALID,
  ERROR_WORKER_NOT_FOUND,
} = require('../lib/orm');
const { saveFile, randomFileName } = require('../lib/storage');
// eslint-disable-next-line no-unused-vars
const { IncomingMessage, ServerResponse } = require('http');

async function write(res, data) {
  try {
    const worker = await writeData(data);
    await performanceTotalWorker(1)
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(worker));
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

function registerSvc(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  const data = {
    name: '',
    address: '',
    phone: '',
    email: '',
    bio: '',
    photo: '',
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
      case 'photo':
        try {
          const fileName = await randomFileName(mimetype);
          await saveFile(file, mimetype, 'photo', fileName);
          data.photo = fileName;
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
    if (['name', 'address', 'email', 'phone', 'bio'].includes(fieldname)) {
      data[fieldname] = val;
    }
  });

  busboy.on('finish', async () => {
    await write(res, data);
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

async function listSvc(req, res) {
  try {
    const workers = await readData();
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(workers));
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

async function removeSvc(req, res) {
  const uri = url.parse(req.url, true);
  const id = uri.query['id'];
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    const worker = await removeData(id);
    performanceTotalWorker(-1)
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.write(JSON.stringify(worker));
    res.end();
  } catch (err) {
    if (err === ERROR_WORKER_NOT_FOUND) {
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
  listSvc,
  registerSvc,
  removeSvc,
};
