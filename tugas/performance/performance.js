const {
  save,
  read,
} = require('../lib/kv');

async function workerLog(msg) {
  let count = await read('workerTotal');
	if (!count) {
    count = 0;
  }
	switch(msg) {
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

module.exports = {
  workerLog,
};