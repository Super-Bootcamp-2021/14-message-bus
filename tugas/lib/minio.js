const mime = require('mime-types');
const { Client } = require('minio');

function randomFileName(mimetype) {
  return (
    new Date().getTime() +
    '-' +
    Math.round(Math.random() * 1000) +
    '.' +
    mime.extension(mimetype)
  );
}

async function saveFile(file, mimetype, fieldname) {
  const client = new Client({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: 'fauzan',
    secretKey: 'miniofauzan',
  });
  const filename = randomFileName(mimetype);

  const check = await client.bucketExists(fieldname);

  if (!check) {
    client.makeBucket(fieldname);
  }

  return new Promise((resolve, reject) => {
    client.putObject(fieldname, filename, file, (err) => {
      if (err) {
        reject(err);
      }
      resolve(filename);
    });
  });
}

module.exports = {
  saveFile,
};
