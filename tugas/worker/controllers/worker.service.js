const Busboy = require('busboy')
const url = require('url')
const { Writable } = require('stream');
const { saveFile } = require('../../storage/storage');
const { register, listWorker, removeWorker } = require('../lib/worker');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const nats = require('../../message/nats');

function saveWorker(req, res) {
    const busboy = new Busboy({ headers: req.headers })
    let messageBus;

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
                  data.photo = "localhost:9999/"+folder+"/"+ await saveFile(file, mimetype, folder);
                  console.log(data.photo)
                } catch (err) {
                  abort();
                }
                if (finished) {
                  try {
                    // const worker = register(data);     // add insert worker herer
                    res.setHeader('content-type', 'application/json');
                    res.write(JSON.stringify({
                        status: 'success',
                        message: 'success add data',
                    }));

                    messageBus = {
                      status: 'success',
                      message: 'success get data',
                    };
                  } catch (err) {
                    //add error handling
                    // if (err === ERROR_REGISTER_DATA_INVALID) {
                    //   res.statusCode = 401;
                    // } else {
                    //   res.statusCode = 500;
                    // }
                    messageBus = {
                      status: 'error',
                      message: 'error register data',
                    };
                    res.write('401');
                  }
                  res.end();
                  nats.publish('worker.register',messageBus);
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


    const messageBus = {
      status: 'success',
      message: 'success get data',
    };


    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    res.write(message)
    res.end()
    nats.publish('worker.get',messageBus);
    
}

//detele data worker
function deleteWorker(req, res) {
    const uri = url.parse(req.url, true)
    const id = uri.pathname.replace('/worker/', '')
    let messageBus; 
    try {
        const result = removeWorker(id);
        message = JSON.stringify({
            status: 'success',
            message: 'success delete data',
        })

        messageBus = {
          status: 'success',
          message: 'success delete data',
        };

        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.write(message)
        res.end()

        nats.publish('worker.delete',messageBus);

    } catch (error) {
        message = JSON.stringify({
            status: 'error',
            message: error.toString(),
        })

        messageBus = {
          status: 'error',
          message: 'error delete data',
        };

        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 400
        res.write(message)
        res.end()

        nats.publish('worker.delete',messageBus);
    }
}



module.exports = { saveWorker, getWorker, deleteWorker }
