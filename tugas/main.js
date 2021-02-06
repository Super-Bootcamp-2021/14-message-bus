const server = require('./task/server');
const serverPerformance = require('./performance/server');
const redis = require('./lib/kv');

async function perf() {
  try {
    console.log('connect to redis service...');
    await redis.connect();
    console.log('redis connected');
  } catch (err) {
    console.error('redis connection failed');
    return;
  }

  console.log('running service...');
  serverPerformance.run();
}

function main(argv) {
  switch (argv[2]) {
    case 'basic':
      require('./storage-service/main');
      break;
    case 'task':
      server.run();
      break;
    case 'performance':
      perf();
      break;
    default:
      console.log(argv[2]);
      process.stdout.write('available commmand are \n');
      process.stdout.write('- basic\n');
      process.stdout.write('- performance\n');
      process.stdout.write('- task\n');
      process.stdout.write(':D\n');
  }
}

main(process.argv);
