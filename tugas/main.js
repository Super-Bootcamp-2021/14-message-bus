const taskServer = require('./task/server');
const workerServer = require('./worker/server');
const {connection} = require('./database/relational/connection');

/**
 * main routine
 * @returns {Promise<void>}
 */
async function main(command) {
  switch (command) {
    case 'task':
      await connection.authenticate(); //db relational connect
      taskServer.run();
      break;
    case 'worker':
      await connection.authenticate(); //db relational connect
      workerServer.run();
      break;
    default:
      console.log(`${command} tidak dikenali`);
      console.log('command yang valid: task, worker');
  }
}

main(process.argv[2]);