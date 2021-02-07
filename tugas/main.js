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
    case 'database':
      require('./database-storage/main');
      break;
    case 'worker':
      require('./workers/main');
      break;
    case 'task':
      server.run();
      break;
    case 'performance':
      perf();
      break;
    case 'object':
      require('./object-storage/main');
      break;
    default:
      console.log(argv[2]);
      process.stdout.write('available commmand are \n');
      process.stdout.write('- database\n');
      process.stdout.write('- worker\n');
      process.stdout.write('- task\n');
      process.stdout.write('- performance\n');
      process.stdout.write('- object\n');
      process.stdout.write(':D\n');
  }
}

main(process.argv);
