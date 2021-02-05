const server = require('./server/server');
const { init } = require('./lib/orm');

async function main() {
  try {
    console.log('trying connecting to database ......');
    await init();
  } catch (err) {
    console.error('server in trouble');
    return;
  }
  console.log('service is running ....');
  server.run();
}

main();
