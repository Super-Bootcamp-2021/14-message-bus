const server = require('./task/server');

function main(argv) {
  switch (argv[2]) {
    case 'basic':
      require('./storage-service/main');
      break;
    case 'nats':
      require('./lib/nats');
      break;
    case 'task':
      server.run();
      break;
    default:
      console.log(argv[2]);
      process.stdout.write('available commmand are \n');
      process.stdout.write('- basic\n');
      process.stdout.write('- task\n');
      process.stdout.write(':D\n');
  }
}

main(process.argv);
