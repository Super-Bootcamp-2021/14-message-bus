const { subscriber } = require('../lib/nats');
const { read, save } = require('../lib/kv');

async function saveTaskAdded() {
  const added = await subscriber('task.added');
  await save('task.added', { task: added });
}

async function saveTaskCancelled() {
  const cancelled = await subscriber('task.cancelled');
  await save('task.cancelled', { cancelled });
}

async function saveTaskDone() {
  const done = await subscriber('task.done');
  await save('task.done', { done });
}

async function saveWorkerAdded() {
  const added = await subscriber('worker.added');
  await save('worker.added', { worker: added });
}

async function readTaskAdded() {
  return await read('task.added');
}

async function readTaskCancelled() {
  return await read('task.cancelled');
}

async function readTaskDone() {
  return await read('task.done');
}

async function readWorkerAdded() {
  return await read('worker.added');
}

module.exports = {
  saveTaskAdded,
  saveTaskCancelled,
  saveTaskDone,
  saveWorkerAdded,
  readTaskAdded,
  readTaskCancelled,
  readTaskDone,
  readWorkerAdded,
};
