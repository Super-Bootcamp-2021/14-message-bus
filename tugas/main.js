const { serve } = require('./lib/server');
const { connect } = require('./lib/orm');
const kv = require('./lib/kv');
const { WorkerSchema } = require('./worker/worker-model');
const { TaskSchema } = require('./task/task-model');

async function init() {
  try {
    console.log('connect to KV service...');
    await kv.connect();
    console.log('KV connected');
  } catch (err) {
    console.error('KV connection failed');
    return;
  }
  try {
    console.log('connect to database');
    await connect([WorkerSchema, TaskSchema], {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'sanbercode',
    });
    console.log('database connected');
  } catch (err) {
    console.error('database connection failed');
    return;
  }
}

async function main() {
  await init();
  serve();
}

main();
