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
  const sub = client.subscribe(subject, (msg) => {
    console.log(msg);
  });
}

module.exports = {
  connect,
  streamer,
  subscriber,
};
