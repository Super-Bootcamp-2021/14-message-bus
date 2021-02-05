const {
  save,
  read,
} = require('../lib/kv');

async function workerLog(type, log) {
  let workers = await read('worker');
  if (!workers) {
    workers = {};
		workers.list = [];
		workers.register = [];
		workers.remove = [];
  }
	switch(type) {
		case list:
			workers.list.push(log);
			break;
		case register:
			workers.register.push(log);
			break;
		case remove:
			workers.remove.push(log);
			break;
		default:
			return;
	}
  await save('worker', workers);
  return;
}