const { read, save } = require('../lib/kv');

/**
 * logic to add workers
 */
async function addWorker(keyName, worker) {
  await save(keyName, worker);
  return worker;
}

/**
 * logic to get workers
 */
async function getWorker(keyName) {
  let workers = await read(keyName);
  if (!workers) {
    workers = 0;
  }
  return workers;
}

module.exports = {
  addWorker,
  getWorker,
};
