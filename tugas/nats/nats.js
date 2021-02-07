/* eslint-disable no-unused-vars */
const nats = require('nats');
const { taskLog, workerLog } = require('./performance.client');

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
  let subTask1, subTask2, subTask3, subTask4;

  subTask1 = client.subscribe(
    'task.created.*',
    async (msg, reply, subject, sid) => {
      await taskLog(msg);
      console.log(msg);
      if (msg === 'unsub') {
        if (subTask1) {
          client.unsubscribe(subTask1);
          console.log('subTask1: unsubscribed');
        }
      }
    }
  );

  subTask2 = client.subscribe('task.done', async (msg, reply, subject, sid) => {
    await taskLog(msg);
    console.log(msg);
    if (msg === 'unsub') {
      if (subTask2) {
        client.unsubscribe(subTask2);
        console.log('subTask2: unsubscribed');
      }
    }
  });

  subTask3 = client.subscribe(
    'task.cancel',
    async (msg, reply, subject, sid) => {
      await taskLog(msg);
      console.log(msg);
      if (msg === 'unsub') {
        if (subTask3) {
          client.unsubscribe(subTask3);
          console.log('subTask1: unsubscribed');
        }
      }
    }
  );

  subTask4 = client.subscribe(
    'worker.created.*',
    async (msg, reply, subject, sid) => {
      await workerLog(msg);
      console.log(msg);
      if (msg === 'unsub') {
        if (subTask4) {
          client.unsubscribe(subTask4);
          console.log('subTask4: unsubscribed');
        }
      }
    }
  );
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
    case 'worker.created':
      client.publish('worker.created.successfully', 'worker.created');
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
