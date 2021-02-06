// const { TaskSchema } = require('./tasks/task.model');
const { WorkerSchema } = require('./worker/worker.model');
const workerServer = require('./worker/server');

/**
 * intiate database and other stroage dependency
 */
async function init() {
  try {
    console.log('connect to orm....');
    await connect([WorkerSchema], {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '12345',
      database: 'dubnium',
    });
    console.log('database connected');
  } catch (err) {
    console.error('database connection failed');
    return;
  }
}

/**
 * main routine
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
      console.log(`${command} tidak dikenali`);
      console.log('command yang valid: task, worker');
  }
}

main(process.argv[2]);
