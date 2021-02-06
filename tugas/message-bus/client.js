/* eslint-disable no-unused-vars */
const nats = require('nats');
const { readStoreMessage, storeMessage } = require('../lib/kv');
const messageClient = nats.connect();

async function keyParser(subject) {
  const split = await subject.split('.');
  const key = await split.slice(1, 3).join('-');
  return key;
}

async function subscriber() {
  return messageClient.subscribe(
    'performance.>',
    async (msg, reply, subject, sid) => {
      if (subject.includes('workers')) {
        switch (subject) {
          case 'performance.workers.total': {
            try {
              const getServiceName = await keyParser(subject);
              let workerCount = await readStoreMessage(getServiceName);
              if (!workerCount) {
                workerCount = 0;
              }
              let count = workerCount + parseInt(msg);
              await storeMessage(getServiceName, count.toString());
              if (parseInt(msg) === -1) {
                console.log(' worker has been deleted');
              } else {
                console.log(' worker has been added');
              }
            } catch (err) {
              console.log('failed to save task log');
            }
          }
        }
      } else if (subject.includes('tasks')) {
        switch (subject) {
          case 'performance.tasks.total':
            {
              try {
                const getServiceName = await keyParser(subject);
                let taskCount = readStoreMessage(getServiceName);
                if (!taskCount) {
                  taskCount = 0;
                }
                let count = taskCount + parseInt(msg);
                await storeMessage(getServiceName, count.toString());
                if (parseInt(msg) === -1) {
                  console.log(' task has been deleted');
                } else {
                  console.log(' task has been added');
                }
              } catch (err) {
                console.log('failed to save task log');
              }
            }
            break;
          case 'performance.tasks.done':
            {
              try {
                const getServiceName = await keyParser(subject);
                let taskCount = readStoreMessage(getServiceName);
                if (!taskCount) {
                  taskCount = 0;
                }
                let count = taskCount + parseInt(msg);
                await storeMessage(getServiceName, count.toString());
                console.log(' task has been done');
              } catch (err) {
                console.log('failed to save task log');
              }
            }
            break;
          case 'performance.tasks.dropped':
            {
              try {
                const getServiceName = await keyParser(subject);
                let taskCount = readStoreMessage(getServiceName);
                if (!taskCount) {
                  taskCount = 0;
                }
                let count = taskCount + parseInt(msg);
                await storeMessage(getServiceName, count.toString());
                console.log('task has been dropped');
              } catch (err) {
                console.log('failed to save task log');
              }
            }
            break;
          default:
            console.log('subject is unkown');
        }
      } else {
        console.error('subject is unkown');
      }
    }
  );
}

async function performanceTotalWorker(data) {
  await messageClient.publish(
    'performance.workers.total',
    JSON.stringify(data)
  );
}
async function performanceTotalTask(data) {
  await messageClient.publish('performance.tasks.total', JSON.stringify(data));
}
async function performanceDoneTask(data) {
  await messageClient.publish('performance.tasks.done', JSON.stringify(data));
}
async function performanceDroppedlTask(data) {
  await messageClient.publish(
    'performance.tasks.dropped',
    JSON.stringify(data)
  );
}

module.exports = {
  performanceDoneTask,
  performanceDroppedlTask,
  performanceTotalTask,
  performanceTotalWorker,
  subscriber,
};
