const nats = require('nats');
const { createClient, getAsync, setAsync } = require('../database/key/redist');
const { stdout } = require('process');

const client = nats.connect();
function init() {
  client.on('connect', () => {
    main();
  });
  
  client.on('error', (err) => {
    console.log({ msg: err });
  });
}

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

  const res = subject.replace(/\.create|\.delete|\.register/, '');
  const key = `total.${res}`;
  console.log(key)
  /**
   * key value
   * task.create => total.task value++
   * task.delete => total.task value--
   * task.complete => total.task.complete value++
   *
   * worker.delete => total.worker value--
   * worker.register => total.worker value++
   *
   */

  try {
    let data;
    if (subject.includes('delete')) {
      data = JSON.parse(await redisGet(key));
      if (!data || data.value === 0) throw new Error('Data is Empty');
      data.value--;
    } else {
      data = JSON.parse(await redisGet(key)) || { value: 0};
      data.value++;
    }

    await redisSet(key, JSON.stringify(data));
  } catch (err) {
    console.log(err);
  }
}

function main() {
  subscriber();
  stdout.write(`📡 subsciber listening ....\n`);
}

module.exports = { init };
