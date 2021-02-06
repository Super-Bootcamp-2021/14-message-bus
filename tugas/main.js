const taskServer = require('./server/workerServer');
const workerServer = require('./server/taskServer');
const performanceServer = require('./server/performanceServer');
const { init } = require('./lib/orm');
const { subscriber } = require('./message-bus/client');
const { kvConnection } = require('./lib/kv');

// cara jalanin = npm start task / npm start worker / npm start performance
async function main(command) {
  switch (command) {
    case 'task':
      await kvConnection();
      await init();
      subscriber();
      taskServer.run();
      break;
    case 'worker':
      await kvConnection();
      await init();
      subscriber();
      workerServer.run();
      break;
    case 'performance':
      await kvConnection();
      subscriber();
      performanceServer.run();
      break;
    default:
      console.log(`${command} tidak dikenali`);
      console.log('command yang valid: task, worker, performance');
  }
}

main(process.argv[2]);
