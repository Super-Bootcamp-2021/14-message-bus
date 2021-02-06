const { save, read } = require('../lib/kv');

async function workerLog(msg) {
  let count = await read('workerTotal');
  if (!count) {
    count = 0;
  }
  switch (msg) {
    case 'add':
      count++;
      break;
    case 'remove':
      count--;
      break;
    default:
      return;
  }
  await save('workerTotal', count);
  return;
}

async function listWorkerTotal() {
  let total = await read('workerTotal');
  if (!total) {
    total = 0;
  }
  return total;
}

module.exports = {
  workerLog,
  listWorkerTotal,
};
