const Busboy = require('busboy');
const url = require('url');
const { Writable } = require('stream');
const {
  register,
  list,
  findWorker,
  del,
  ERROR_REGISTER_DATA_INVALID,
  ERROR_WORKER_NOT_FOUND,
} = require('./working-logic');
const { upload } = require('../database/typeorm/storage');
const { loggingMsg } = require('./performance-service')


function storeWorkerService(req, res) {
  const busboy = new Busboy({ headers: req.headers });
  res.setHeader('content-type', 'application/json');
  const data = {
    name: '',
    email: '',
    biografi: '',
    address: '',
    nohp: '',
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
        upload(data, fieldname, file, mimetype, abort);
    }
  });

  busboy.on('field', (fieldname, val) => {
    if (['name', 'email', 'biografi', 'nohp', 'address'].includes(fieldname)) {
      data[fieldname] = val;
    }
  });

  busboy.on('finish', async () => {
    try {
      const worker = await register(data);
      await res.write(JSON.stringify(worker));
      loggingMsg('totalWorkers', res.statusCode);
    } catch (err) {
      if (err === ERROR_REGISTER_DATA_INVALID) {
        res.statusCode = 401;
      } else {
        res.statusCode = 500;
      }
      res.write(err);
    }
    await res.end();
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

async function getWorkerService(req, res) {
  try {
    const workers = await list();
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(workers));
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

async function getWorkerByIdService(req, res) {
  const uri = url.parse(req.url, true);
  const id = uri.query['id'];
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    const worker = await findWorker(id);
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

async function deleteWorkerService(req, res) {
  const uri = url.parse(req.url, true);
  const id = uri.query['id'];
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    await del(id);
    res.statusCode = 200;
    res.write(`berhasil dihapus`);
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
  storeWorkerService,
  getWorkerService,
  getWorkerByIdService,
  deleteWorkerService
};
