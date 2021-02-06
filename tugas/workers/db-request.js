const http = require('http');

const PORT = 6000;

function insertWorker(data) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `http://localhost:${PORT}/worker/write?data=${JSON.stringify(data)}`,
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
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

function selectWorker(data) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `http://localhost:${PORT}/worker/read`,
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
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

function selectWorkerById(id) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `http://localhost:${PORT}/worker/id?id=${id}`,
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
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

function deleteWorker(id) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      `http://localhost:${PORT}/worker/delete?id=${id}`,
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
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
  insertWorker,
  selectWorker,
  deleteWorker,
  selectWorkerById
};
