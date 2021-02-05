/* eslint-disable no-unused-vars */
const nats = require('nats');
const messageClient = nats.connect();

async function subscriber() {
  return messageClient.subscribe(
    'performance.>',
    async (msg, reply, subject, sid) => {
      console.log(msg)
      if (subject === 'performance.worker.create') {
        try {
          const getServiceName = await subject.split('.')[1];
          await
          await storeMessage(getServiceName, 1);
        } catch (err) {
          console.log('failed to save task log');
        }
      } else if (subject === 'subject.worker.write') {
        try {
          const getServiceName = await subject.split('.')[1];
          await storeMessage(getServiceName, msg);
        } catch (err) {
          console.log('failed to save task log');
        }
      } else {
        console.error('subject is unkown');
      }
    // }
    });
}

module.exports = { messageClient, subscriber };


const minio = require('minio')


