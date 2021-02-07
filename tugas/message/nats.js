const nats = require('nats');

let client;

/**
 * connect to database
 * @returns {Promise<void>}
 */
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

function publish(subject, message) {
  message.date = getCurrentDate();
  client.publish(subject, JSON.stringify(message));
}

function subscribe(subject, callback) {
  client.subscribe(subject, callback);
}

function getCurrentDate(){
  let date = new Date();
  let year = date.getFullYear();
  let day = date.getDate();
  let month = date.getMonth();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

module.exports = { connect, publish, subscribe };
