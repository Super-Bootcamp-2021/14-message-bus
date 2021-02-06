const redis = require('redis');
const { promisify } = require('util');

function kvConnection() {
  return new Promise((resolve, reject) => {
    client = redis.createClient();
    client.on('connect', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
  });
}

async function storeMessage(keyname, counter) {
  const setAsync = promisify(client.set).bind(client);
  const val = await setAsync(keyname, counter);
  return val;
}

async function readStoreMessage(keyname) {
  const getAsync = promisify(client.get).bind(client);
  const val = await getAsync(keyname);
  return parseInt(val);
}

module.exports = { kvConnection, storeMessage, readStoreMessage };
