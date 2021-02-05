const mime = require('mime-types');
// eslint-disable-next-line no-unused-vars
const { Readable } = require('stream');
const { Client } = require('minio');

/**
 * set MINIO_ROOT_USER=local-minio
 * set MINIO_ROOT_PASSWORD=local-test-secret
 */
const client = new Client({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: 'minio',
  secretKey: 'miniostorage',
});

/**
 * generate random file name
 * @param {string} mimetype mimetype
 * @returns {string} generated file name
 */
function randomFileName(mimetype) {
  return (
    new Date().getTime() +
    '-' +
    Math.round(Math.random() * 1000) +
    '.' +
    mime.extension(mimetype)
  );
}

function saveFile(bucket, file, mimetype) {
  const destname = randomFileName(mimetype);
  return new Promise((resolve, reject) => {
    client.putObject(bucket, destname, file, (err, etag) => {
      if (err) {
        reject(err);
      }
      resolve(destname);
    });
  });
}

module.exports = {
  saveFile,
};
