const mime = require('mime-types');
const { Client } = require('minio');

const client = new Client({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: 'admin',
  secretKey: 'password',
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

function storeObject(bucket, file, mimetype) {
  const objectName = randomFileName(mimetype);
  client.putObject(bucket, objectName, file, (err, etag) => {
    if (err) {
      console.log(err);
    }
  });
  return objectName;
}

async function readObject(bucket, objectName) {
  try {
    await client.getObject(bucket, objectName);
  } catch (err) {
    return;
  }
}

async function statObject(bucket,  objectName) {
  try {
    await client.statObject(bucket, objectName);
  } catch (err) {
    return;
  }
}

module.exports = {
  storeObject,
  readObject,
  statObject,
};
