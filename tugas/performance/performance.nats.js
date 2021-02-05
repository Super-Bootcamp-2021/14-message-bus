const { sub } = require('../lib/msgbus');
const {workerLog} = require('./performance');

function workerSubscriber() {	
  	const workerSub = sub('worker.*', workerSubHandling);
    return;
}

async function workerSubHandling(msg, reply, subject, sid) {
	const type = subject.replace('worker.', '');
	await workerLog(type, JSON.parse(msg));
};

module.exports = {
  workerSubscriber,
};
