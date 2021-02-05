const { serve } = require('./lib/server');
const { connect } = require('./lib/orm');
const kv = require('./lib/kv');
const mb = require('./lib/nats');
const { WorkerSchema } = require('./worker/worker-model');
const { TaskSchema } = require('./task/task-model');

async function initKV() {
  try {
    console.log('connect to KV service...');
    await kv.connect();
    console.log('KV connected');
  } catch (err) {
    console.error('KV connection failed');
    return;
  }
}

async function initDB() {
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

async function initMB() {
  try {
    console.log('connect to Message Bus service...');
    await mb.connect();
    console.log('Message Bus connected');
  } catch (err) {
    console.error('Message Bus connection failed');
    return;
  }
}

async function main() {
  await initDB();
  await initKV();
  await initMB();
  serve();
}

main();
require('./performance/performance')
