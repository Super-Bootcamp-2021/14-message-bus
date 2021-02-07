const http = require('http');

const PORT = 6000;

function createTask(data) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `http://localhost:${PORT}/task/write?data=${JSON.stringify(data)}`,
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

//createTask({assignee_id: 3, job: 'ngoding', attachment: 'file.jpg', done: true});

function updateTask(data) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `http://localhost:${PORT}/task/update?data=${JSON.stringify(data)}`,
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

//updateTask({id: 1, job: 'bermain', attachment: 'file.jpg', done: true});

function cancelTask(data) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `http://localhost:${PORT}/task/cancel?data=${JSON.stringify(data)}`,
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

//cancelTask(4);

function doneTask(data) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `http://localhost:${PORT}/task/done?data=${JSON.stringify(data)}`,
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
  createTask,
  updateTask,
  cancelTask,
  doneTask,
};
