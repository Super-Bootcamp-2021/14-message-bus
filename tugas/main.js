const server = require('./server/server');
const { init } = require('./lib/orm');
const { subscriber } = require('./message-bus/client');
const { kvConnection } = require('./lib/kv')

async function main() {
  try {
    console.log('trying connecting to database ......');
    await init();
    await kvConnection();
  } catch (err) {
    console.error('server in trouble');
    return;
  }
  console.log('service is running ....');
  subscriber();
  server.run();
}

main();
