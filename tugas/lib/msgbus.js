const nats = require('nats');
const { promisify } = require('util');

let client;

function connect() {
  return new Promise((resolve, reject) => {
    client = nats.connect();
    client.on('connect', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
  });
}

function sub(subjectName, callback) {
  const subAsync = promisify(client.subscribe).bind(client);
  return subAsync(subjectName, callback);
}

function unsub(subscriber) {
  const unsubAsync = promisify(client.unsubscribe).bind(client);
  return unsubAsync(subscriber);
}

async function pub(subjectName, msg) {
  const pubAsync = promisify(client.publish).bind(client);
  await pubAsync(subjectName, msg);
  return;
}

function close() {
  if (client.connected) {
    client.close();
  }
}

module.exports = {
  connect,
  sub,
  unsub,
  pub,
  close,
};
