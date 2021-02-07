const nats = require('nats');

let client;

let totalWorker = 0;
let totalTask = 0;
let totalDone = 0;
let totalCancel = 0;
let result = 0;

function connect() {
  return new Promise((resolve, reject) => {
    client =  nats.connect();
    client.on('connect', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
  });
}

function close() {
  client.on('close', (err) => {
    if (err) {
      console.error(err);
    }
    console.log('connection close');
  });
}

function publisher(subject, message) {
  client.publish(subject, message);
  console.log(`${message} publish: ${message}, subject: ${subject}`);
}

function subscriber(subject) {
  client =  nats.connect();
  client.subscribe(subject, (msg, reply, subject, sid) => {
    console.log('Subscribe: ', msg);
    if (msg === 'unsub') {
      client.unsubscribe();
      console.log('Unsubscribed');
    }
    if (msg === 'worker') {
      totalWorker++;
      result = totalWorker;
    } else if (msg === 'task') {
      totalTask++;
      result = totalTask;
    }
  });
}

function getResult(){
  return result;
}

module.exports = {
  connect,
  close,
  publisher,
  subscriber,
  getResult,
};
