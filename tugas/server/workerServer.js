const { createServer } = require('http');
const { stdout } = require('process');
const { router } = require('./workerRouter');

let server;

function run() {
  server = createServer((req, res) => {
    router(req, res);
  });

  const PORT = 1979;
  server.listen(PORT, () => {
    stdout.write(`🚀 worker server listening on port ${PORT}\n`);
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
