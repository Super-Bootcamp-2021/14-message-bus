const Busboy = require('busboy');
const url = require('url');
const { Writable } = require('stream');
const { saveFile } = require('../lib/minio');
const { writeWorker, readWorker, deleteWorker } = require('./worker');

async function writeWorkerService(req, res) {
  const busboy = new Busboy({ headers: req.headers });
  let obj = {};
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
      case 'photo':
        {
          try {
            const photo = await saveFile(file, mimetype, fieldname);
            obj[`${fieldname}`] = await photo;
          } catch (err) {
            abort();
          }

          if (finished) {
            const reg = await writeWorker(obj);
            res.write(reg);
            res.end();
          }
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

  busboy.on('field', async (fieldname, val) => {
    obj[`${fieldname}`] = val;
  });

  busboy.on('finish', async () => {
    finished = true;
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

async function readWorkerService(req, res) {
  const data = await readWorker();
  res.setHeader('Content-Type', 'application/json');
  res.write(data);
  res.statusCode = 200;
  res.end();
}

async function deleteWorkerService(req, res) {
  const uri = url.parse(req.url, true);
  const id = uri.pathname.replace('/pekerja/delete/', '');
  if (!id) {
    res.statusCode = 400;
    res.write('request tidak sesuai');
    res.end();
  }

  await deleteWorker(id);
  res.write(`data pekerja dengan id ${id} telah dihapus.`);
  res.statusCode = 200;
  res.end();
}

module.exports = {
  writeWorkerService,
  readWorkerService,
  deleteWorkerService,
};
