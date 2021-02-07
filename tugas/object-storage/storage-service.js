/* eslint-disable no-unused-vars */
const mime = require('mime-types');
const { Writable } = require('stream');
const Busboy = require('busboy');
const url = require('url');
const { Client } = require('minio');

/**
 * set MINIO_ROOT_USER=local-minio
 * set MINIO_ROOT_PASSWORD=local-test-secret
 */
const client = new Client({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
});

function randomFileName(mimetype) {
    return (
        new Date().getTime() +
        '-' +
        Math.round(Math.random() * 1000) +
        '.' +
        mime.extension(mimetype)
    );
}

function uploadService(req, res) {
    return new Promise((resolve, reject) => {
        const busboy = new Busboy({ headers: req.headers });
        function abort() {
            req.unpipe(busboy);
            if (!req.aborted) {
                res.statusCode = 413;
                res.end();
            }
        }

        let nama_file = '';
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            const objectName = randomFileName(mimetype);
            nama_file = objectName;
            console.log(fieldname);
            console.log(objectName);

            switch (fieldname) {
                case 'photo':
                    file.on('error', abort);
                    client.putObject('photo', objectName, file, (err, etag) => {
                        if (err) {
                            console.log(err);
                            abort();
                        }
                    });
                    break;
                case 'attachment':
                    file.on('error', abort);
                    client.putObject('attachment', objectName, file, (err, etag) => {
                        if (err) {
                            console.log(err);
                            abort();
                        }
                    });
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
            console.log(val);
        });
        
        busboy.on('finish', () => {
            resolve(nama_file);            
        });

        req.on('aborted', abort);
        busboy.on('error', abort);

        req.pipe(busboy);
    });
}

async function readService(req, res) {
    const uri = url.parse(req.url, true);
    const objectName = uri.pathname.replace('/read/', '');
    if (!objectName) {
        res.statusCode = 400;
        res.write('request tidak sesuai');
        res.end();
    }
    try {
        await client.statObject('photo', objectName);
    } catch (err) {
        if (err && err.code === 'NotFound') {
            res.statusCode = 404;
            res.write('file tidak ditemukan');
            res.end();
            return;
        }
        res.statusCode = 500;
        res.write('gagal membaca file');
        res.end();
        return;
    }
    
    try {
        const objectRead = await client.getObject('photo', objectName);
        res.setHeader('Content-Type', mime.lookup(objectName));
        res.statusCode = 200;
        objectRead.pipe(res);
    } catch (err) {
        res.statusCode = 500;
        res.write('gagal membaca file');
        res.end();
        return;
  }
}

async function deleteService(objectName) {
    // const uri = url.parse(req.url, true);
    // const objectName = uri.pathname.replace('/delete/', '');
  
    try {
        await client.statObject('photo', objectName);            
    } catch (err) {
        if (err && err.code === 'NotFound') {
            return false;
        }
        throw new Error('gagal membaca file');      
    }

    try {
        await client.removeObject('photo', objectName);
        return true;
    } catch (err) {
        throw new Error(`file ${objectName} tidak ditemukan`)        
    }
}


function uploadAttachment(file, mimetype) {
    return new Promise((resolve, reject) => {
        const objectName = randomFileName(mimetype);
        client.putObject('attachment', objectName, file, (err, etag) => {
            if (err) {
                console.error(err);
                reject(err);
            }
        });

        resolve(objectName);
    })
}


module.exports = {
  uploadService,
  readService,
  deleteService,
  uploadAttachment,
};
