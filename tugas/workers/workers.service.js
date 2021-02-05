const Busboy = require('busboy');
const { Writable } = require('stream');
const { saveFile } = require('../lib/storage');
const { main, setupRelationship, create, writeData } = require('./workers.js');

function createSvc(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  const data = {
    name: '',
    adress: '',
    email: '',
    notelp: '',
    biografi: '',
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
      case 'name':
        try {
          data.attachment = await saveFile(file, mimetype);
        } catch (err) {
          abort();
        }
        if (finished) {
          try {
            const task = await create(data);
            res.setHeader('content-type', 'application/json');
            res.write(JSON.stringify(task));
          } catch (err) {
            if (err === 'Data Not Found') {
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

  busboy.on('field', async (fieldname, val) => {
    if (['adress', 'email', 'notelp', 'biografi'].includes(fieldname)) {
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

module.exports = {
  createSvc,
};
