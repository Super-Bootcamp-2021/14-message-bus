const nats = require('../message/nats')
const { stdout } = require('process');

function init() {
  // eslint-disable-next-line no-unused-vars
  let task = nats.subscribe('task.create', (subject) => {
    stdout.write('sub-1: ', subject);
  });

  stdout.write(`📡 subsciber listening ....\n`);
}

module.exports = { init };
