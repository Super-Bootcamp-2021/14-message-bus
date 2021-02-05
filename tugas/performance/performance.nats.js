const {
  sub,
} = require('../lib/msgbus');

async function workerSubscriber() {
  workerSub = sub('worker.*', (msg, reply, subject, sid) => {
    const type = subject.replace('worker.', '');
		await workerLog(type, JSON.parse(msg));
  });
}

module.exports = {
  workerSubscriber,
};
