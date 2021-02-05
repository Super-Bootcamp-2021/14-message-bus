/* eslint-disable no-unused-vars */
const nats = require('nats');
const { taskLog } = require('./performance.client');

const client = nats.connect();

client.on('connect', () => {
  main();
});

client.on('close', (err) => {
  if (err) {
    console.error(err);
  }
  console.log('connection close');
});

function subscriber() {
  let subTask1, subTask2, subTask3;

  subTask1 = client.subscribe('task.created.*', (msg, reply, subject, sid) => {
    taskLog(msg);
    console.log(msg);
    if (msg === 'unsub') {
      if (subTask1) {
        client.unsubscribe(subTask1);
        console.log('subTask1: unsubscribed');
      }
    }
  });

  subTask2 = client.subscribe('task.done', (msg, reply, subject, sid) => {
    taskLog(msg);
    console.log(msg);
    if (msg === 'unsub') {
      if (subTask2) {
        client.unsubscribe(subTask2);
        console.log('subTask2: unsubscribed');
      }
    }
  });

  subTask3 = client.subscribe('task.cancel', (msg, reply, subject, sid) => {
    taskLog(msg);
    console.log(msg);
    if (msg === 'unsub') {
      if (subTask3) {
        client.unsubscribe(subTask3);
        console.log('subTask1: unsubscribed');
      }
    }
  });
}

function streamer(data) {
  switch (data) {
    case 'task.created':
      client.publish('task.created.successfully', 'task.created');
      break;
    case 'task.done':
      client.publish('task.done', 'task.done');
      break;
    case 'task.cancel':
      client.publish('task.cancel', 'task.cancel');
      break;
    default:
      break;
  }
}

function main() {
  subscriber();
  streamer();
}

module.exports = {
  streamer,
};
