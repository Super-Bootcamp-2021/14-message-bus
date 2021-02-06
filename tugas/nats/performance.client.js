const http = require('http');

const PORT = 3232;

function taskLog(data) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `http://localhost:${PORT}/task?data=${data}`,
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk.toString();
        });
        res.on('end', () => {
          resolve(data);
        });
        res.on('error', (err) => {
          reject(err);
        });
      }
    );
    req.end();
  });
}

module.exports = {
  taskLog,
};
