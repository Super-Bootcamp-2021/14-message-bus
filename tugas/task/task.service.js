const Busboy = require('busboy');
const { Writable } = require('stream');
const { saveFile } = require('../lib/storage');
const {
  create,
  cancel,
  done,
  update,
  ERROR_CREATE_DATA_INVALID,
} = require('./task');

function createSvc(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  const data = {
    job: '',
    attachment: '',
    done: '',
    cancel: '',
    assigneeId: null,
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
      case 'attachment':
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
            if (err === ERROR_CREATE_DATA_INVALID) {
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
    if (['job', 'done', 'cancel', 'assigneeId'].includes(fieldname)) {
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

function updateSvc(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  const data = {
    job: '',
    attachment: '',
    done: '',
    cancel: '',
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
      case 'attachment':
        try {
          data.attachment = await saveFile(file, mimetype);
        } catch (err) {
          abort();
        }
        if (finished) {
          try {
            const task = await update(data);
            res.setHeader('content-type', 'application/json');
            res.write(JSON.stringify(task));
          } catch (err) {
            if (err === ERROR_CREATE_DATA_INVALID) {
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
    if (['job', 'done', 'cancel', 'id', 'assigneeId'].includes(fieldname)) {
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

function doneSvc(req, res) {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk.toString();
  });

  req.on('end', async () => {
    const { id } = JSON.parse(data);
    const task = await done(id);
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(task));
    res.end();
  });
}

function cancelSvc(req, res) {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk.toString();
  });

  req.on('end', async () => {
    const { id } = JSON.parse(data);
    const task = await cancel(id);
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(task));
    res.end();
  });
}

module.exports = {
  createSvc,
  updateSvc,
  doneSvc,
  cancelSvc,
};
