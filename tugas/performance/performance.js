const { subscriber } = require('../lib/nats');
const { read, save } = require('../lib/kv');

async function saveTaskAdded() {
  const added = await subscriber('task.added');
  await save('task.added', added);
}

async function saveTaskCancelled() {
  const added = await subscriber('task.cancelled');
  await save('task.cancelled', added);
}

async function saveTaskDone() {
  const added = await subscriber('task.done');
  await save('task.done', added);
}

async function saveWorkerAdded() {
  const added = await subscriber('worker.added');
  await save('worker.added', added);
}

module.exports = {
  saveTaskAdded,
  saveTaskCancelled,
  saveTaskDone,
  saveWorkerAdded,
};
