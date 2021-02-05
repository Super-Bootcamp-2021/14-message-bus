const taskServer = require('./task/server');
const workerServer = require('./worker/server');
const { connection } = require('./database/relational/connection');
const nats = require('./message/nats');
const subscriber = require('./performance/subscriber');
/**
 * main routine
 * @returns {Promise<void>}
 */
async function main(command) {
  switch (command) {
    case 'task':
      await connection.authenticate(); //db relational connect
      await nats.connect();
      taskServer.run();
      break;
    case 'worker':
      await connection.authenticate(); //db relational connect
      await nats.connect();
      workerServer.run();
      break;
    case 'performance':
      await nats.connect();
      subscriber.init();
      break;
    default:
      console.log(`${command} tidak dikenali`);
      console.log('command yang valid: task, worker');
  }
}

main(process.argv[2]);