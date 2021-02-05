const Busboy = require('busboy')
const url = require('url')
const { Writable } = require('stream');
const { saveFile } = require('../../storage/storage');
const { register, listWorker, removeWorker } = require('../lib/worker');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// save data worker
function saveWorker(req, res) {
    const busboy = new Busboy({ headers: req.headers })

    let data = {        
        name: '',
        address: '',
        email: '',
        phone: '',
        biografi: '',
    }

    let finished = false;
    function abort() {
        req.unpipe(busboy)
        if (!req.aborted) {
            res.statusCode = 413
            res.end()
        }
    }

    busboy.on('field', (fieldname, val) => {
        data[fieldname] = val
    })

    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        switch (fieldname) {
            case 'photo':
                try {
                  const folder = 'photo';
                  data.photo = "localhost:9999/photo/"+await saveFile(file, mimetype,folder);
                } catch (err) {
                  abort();
                }
                if (finished) {
                  try {
                    const worker = register(data);     // add insert worker herer
                    res.setHeader('content-type', 'application/json');
                    res.write(JSON.stringify({
                        status: 'success',
                        message: 'success add data',
                    }));
                  } catch (err) {
                    //add error handling
                    // if (err === ERROR_REGISTER_DATA_INVALID) {
                    //   res.statusCode = 401;
                    // } else {
                    //   res.statusCode = 500;
                    // }
                    res.write('401');
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
    
    busboy.on('finish', async () => {
        finished = true;
    });

    req.on('aborted', abort)
    busboy.on('error', abort)

    req.pipe(busboy)
}

//get data worker
async function getWorker(req, res) {

    const data = await listWorker();

    const message = JSON.stringify({
        status: 'success',
        message: 'success get data',
        data: data,
    })
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    res.write(message)
    res.end()
}

//detele data worker
function deleteWorker(req, res) {
    const uri = url.parse(req.url, true)
    const id = uri.pathname.replace('/worker/', '')
    try {
        const result = removeWorker(id);
        message = JSON.stringify({
            status: 'success',
            message: 'success delete data',
        })
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.write(message)
        res.end()

    } catch (error) {
        message = JSON.stringify({
            status: 'error',
            message: error.toString(),
        })
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 400
        res.write(message)
        res.end()
    }
}

function photoService(req, res) {
    const uri = url.parse(req.url, true);
    const filename = uri.pathname.replace('/photo/', '');
    if (!filename) {
      res.statusCode = 400;
      res.write('request tidak sesuai');
      res.end();
    }
    const file = path.resolve(__dirname, `../storage/photo/${filename}`);
    const exist = fs.existsSync(file);
    if (!exist) {
      res.statusCode = 404;
      res.write('file tidak ditemukan');
      res.end();
    }
    const fileRead = fs.createReadStream(file);
    res.setHeader('Content-Type', mime.lookup(filename));
    res.statusCode = 200;
    fileRead.pipe(res);
  }

module.exports = { saveWorker, getWorker, deleteWorker,photoService}