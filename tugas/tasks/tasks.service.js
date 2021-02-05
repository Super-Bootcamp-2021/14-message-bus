const Busboy = require('busboy');
const url = require('url');
const { Writable } = require('stream');
const {
  writeDataTask,
  doneDataTask,
  ERROR_REGISTER_DATA_INVALID,
  ERROR_WORKER_NOT_FOUND,
} = require('../lib/orm');
const { saveFile } = require('../lib/storage');

function createTsk(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  const data = {
    job: '',
    assigneeId: 0,
    attachment: '',
    done: false,
    cancel: false,
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
    finished = true;
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

// async function listSvc(req, res) {
//   try {
//     const workers = await list();
//     res.setHeader('content-type', 'application/json');
//     res.write(JSON.stringify(workers));
//     res.end();
//   } catch (err) {
//     res.statusCode = 500;
//     res.end();
//     return;
//   }
// }

// async function removeSvc(req, res) {
//   const uri = url.parse(req.url, true);
//   const id = uri.query['id'];
//   if (!id) {
//     res.statusCode = 401;
//     res.write('parameter id tidak ditemukan');
//     res.end();
//     return;
//   }
//   try {
//     const worker = await remove(id);
//     res.setHeader('content-type', 'application/json');
//     res.statusCode = 200;
//     res.write(JSON.stringify(worker));
//     res.end();
//   } catch (err) {
//     if (err === ERROR_WORKER_NOT_FOUND) {
//       res.statusCode = 404;
//       res.write(err);
//       res.end();
//       return;
//     }
//     res.statusCode = 500;
//     res.end();
//     return;
//   }
// }

module.exports = {
  // listSvc,
  createTsk,
  doneTsk,
  // removeSvc,
};
