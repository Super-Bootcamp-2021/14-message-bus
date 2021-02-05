const { connect } = require('./lib/orm');
const workerServer = require('./worker/server');

/**
 * intiate database and other stroage dependency
 */
async function init() {
  try {
    console.log('connect to database');
    await connect('sanbercode2', 'postgres', 'postgres', {
      host: 'localhost',
      port: 5432,
      dialect: 'postgres',
      logging: false,
    });
    console.log('database connected');
  } catch (err) {
    console.error('database connection failed');
    return;
  }
}

/**
 * main routine
 * @param {string} command launch command
 * @returns {Promise<void>}
 */
async function main(command) {
  switch (command) {
    case 'task':
      // TODO: implement task service
      break;
    case 'worker':
      await init();
      workerServer.run();
      break;
    default:
      console.log(`${command} 5tidak dikenali`);
      console.log('command yang valid: task, worker');
  }
}

main(process.argv[2]);
