const { connect } = require('./lib/orm');
const server = require('./server/server');

/**
 * intiate database and other stroage dependency
 */
async function init() {
  try {
    console.log('connect to database');
    await connect('erbium', 'root', '', {
      host: 'localhost',
      port: 3306,
      dialect: 'mysql',
      logging: false,
      ssl: true,
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
  if (command) {
    await init();
    server.run();
  } else {
    console.log(`${command} 5tidak dikenali`);
    console.log('command yang valid: task, worker');
  }
}

main(process.argv[2]);
