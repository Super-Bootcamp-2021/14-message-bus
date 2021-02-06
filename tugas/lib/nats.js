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

function streamer(subject, message) {
  client.publish(subject, message);
}

function subscriber(subject) {
  return new Promise((resolve) => {
    client.subscribe(subject, (msg) => {
      resolve(msg);
    });
  });
}

module.exports = {
  connect,
  streamer,
  subscriber,
};
