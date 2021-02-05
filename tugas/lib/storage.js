const mime = require('mime-types');
const { Client } = require('minio');

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

async function saveFile(file, mimetype, destination, nameFile) {
  const destname = nameFile;
  client.putObject(destination, destname, file, (err, etag) => {
    if (err) {
      console.log(err);
    }
    return etag;
  });
}

module.exports = {
  saveFile,
  randomFileName,
};
