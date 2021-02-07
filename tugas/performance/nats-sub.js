const nats = require('nats');
const { createClient, getAsync, setAsync } = require('../database/key/redist');

const client = nats.connect();

client.on('connect', () => {
  main();
});

client.on('error', (err) => {
  console.log({ msg: err });
});

function subscriber() {
  client.subscribe('task.get', subToKeyValue);
  client.subscribe('task.create', subToKeyValue);
  client.subscribe('task.delete', subToKeyValue);
  client.subscribe('task.completed', subToKeyValue);
  client.subscribe('worker.register', subToKeyValue);
  client.subscribe('worker.delete', subToKeyValue);
  client.subscribe('worker.get', subToKeyValue);
}

async function subToKeyValue(msg, reply, subject, sid) {
  const clientRed = createClient();
  const redisSet = setAsync(clientRed);
  const redisGet = getAsync(clientRed);
  let key = ['.trial'];

  if (subject.includes('worker')) {
    key.unshift('worker');
  } else {
    key.unshift('task');
  }

  key = key.join('');

  try {
    const data = JSON.parse(await redisGet(key)) || [];
    data.push({ message: msg, date: getCurrentDate() });
    await redisSet('task.trial', JSON.stringify(data, null, 2));
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

function streamer() {
  // Ceritanya dari controller
  const messageBusDelete = {
    status: 'success',
    message: 'success delete task',
  };

  const messageBusCompleted = {
    status: 'success',
    message: 'success completed task',
  };

  const messageBusCreate = {
    status: 'success',
    message: 'success add task',
  };
  client.publish('get.all');
  // event
  client.publish('task.create', JSON.stringify(messageBusCreate, null, 2));
  client.publish('task.delete', JSON.stringify(messageBusDelete, null, 2));
  client.publish(
    'task.completed',
    JSON.stringify(messageBusCompleted, null, 2)
  );

  const workerRegister = {
    status: 'success',
    message: 'success get data',
  };

  const workerGet = {
    status: 'success',
    message: 'success get data',
  };

  const workerDelete = {
    status: 'success',
    message: 'success delete data',
  };

  client.publish('worker.register', JSON.stringify(workerRegister, null, 2));
  client.publish('worker.delete', JSON.stringify(workerDelete, null, 2));
  client.publish('worker.get', JSON.stringify(workerGet, null, 2));
}

function getCurrentDate() {
  let date = new Date();
  let year = date.getFullYear();
  let day = date.getDate();
  let month = date.getMonth();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function main() {
  subscriber();
  streamer();
}
