const redis = require('redis');
const { promisify } = require('util');

let client;

/**
 * connect to database
 */
function connect() {
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

/**
 * save a database
 */
function save(db, data) {
  const setAsync = promisify(client.set).bind(client);
  return setAsync(db, JSON.stringify(data));
}

/**
 * read content of a database
 */
async function read(db) {
  const getAsync = promisify(client.get).bind(client);
  const val = await getAsync(db);
  return JSON.parse(val);
}

/**
 * remove a database
 */
function drop(db) {
  const delAsync = promisify(client.del).bind(client);
  return delAsync(db);
}

/**
 * close database connection
 */
function close() {
  if (client.connected) {
    client.end(true);
  }
}

module.exports = {
  connect,
  save,
  read,
  close,
  drop,
};
