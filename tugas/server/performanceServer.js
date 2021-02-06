const { createServer } = require('http');
const { stdout } = require('process');
const { router } = require('./performanceRouter');

let server;

function run() {
  server = createServer((req, res) => {
    router(req, res);
  });

  const PORT = 1977;
  server.listen(PORT, () => {
    stdout.write(`🚀 performance server listening on port ${PORT}\n`);
  });
}

function stop() {
  if (server) {
    server.close();
  }
}

module.exports = {
  run,
  stop,
};
