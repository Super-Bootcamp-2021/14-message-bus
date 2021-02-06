const nats = require('nats');

const {
  createClient,
  getAsync,
  setAsync,
} = require('../database/key/redist');

const client = nats.connect();

client.on('connect', () => {
  main();
});

client.on('error', (err) => {
  console.log({ msg: err });
});

function subscriber() {
  const setSubs = ['task.create', 'task.delete'];
  client.subscribe('task.get', async (msg, reply, subject, sid) => {
    console.log('get');
    const clientRed = createClient();
    const redisGet = getAsync(clientRed);

    try {
      const get = await redisGet('task.trial');
      console.log(JSON.parse(get));
    } catch (err) {
      console.log(err);
    }
  });

  client.subscribe('task.create', async (msg, reply, subject, sid) => {
    console.log('create');
    const clientRed = createClient();
    const redisSet = setAsync(clientRed);
    const redisGet = getAsync(clientRed);

    try {
      const data = JSON.parse(await redisGet('task.trial'));
      data.push({ task: msg });
      await redisSet('task.trial', JSON.stringify(data, null, 2));
    } catch (err) {
      console.log(err);
    }
  });

  client.subscribe('task.delete', async (msg, reply, subject, sid) => {
    console.log('delete');
    const clientRed = createClient();
    const redisSet = setAsync(clientRed);
    const redisGet = getAsync(clientRed);

    try {
      const data = JSON.parse(await redisGet('task.trial'));
      data.push({ task: msg });
      await redisSet('task.trial', JSON.stringify(data, null, 2));
    } catch (err) {
      console.log(err);
    }
  });

  client.subscribe('task.completed', async (msg, reply, subject, sid) => {
    console.log('completed')
    const clientRed = createClient();
    const redisSet = setAsync(clientRed);
    const redisGet = getAsync(clientRed);

    try {
      const data = JSON.parse(await redisGet('task.trial'));
      data.push({ task: msg });
      await redisSet('task.trial', JSON.stringify(data, null, 2));
    } catch (err) {
      console.log(err);
    }
  });
}

function streamer() {
  const messageBusCreate = {
    status: 'success',
    message: 'success add task',
  };

  const messageBusDelete = {
    status: 'success',
    message: 'success delete task',
  };

  const messageBusCompleted = {
    status: 'success',
    message: 'success completed task',
  };

  client.publish('task.create', JSON.stringify(messageBusCreate, null, 2));

  client.publish('task.delete', JSON.stringify(messageBusDelete, null, 2));
  client.publish(
    'task.completed',
    JSON.stringify(messageBusCompleted, null, 2)
  );
  client.publish('task.get');
}

function main() {
  subscriber();
  streamer();
}
