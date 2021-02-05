const server = require('./task/server');

function main(argv) {
  switch (argv[2]) {
    case 'database':
      require('./database-storage/main');
      break;
    case 'task':
      server.run();
      break;
    case 'object':
        require('./object-storage/main');
        break;
    default:
      console.log(argv[2]);
      process.stdout.write('available commmand are \n');
      process.stdout.write('- database\n');
      process.stdout.write('- task\n');
      process.stdout.write('- object\n');
      process.stdout.write(':D\n');
  }
}

main(process.argv);
