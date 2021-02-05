const nats = require('nats');

let client;

function connect() {
  return new Promise((resolve, reject) => {
    client = nats.connect();
    client.on('connect', () => {
      resolve();
    });

    client.on('error', (err) => {
      if (err) {
        reject(err);
      }
    });
  });
}

module.exports = {
  connect,
};
