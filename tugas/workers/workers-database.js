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

async function init() {
  const orm1 = new Sequelize('sanbercode2', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: 'mariadb',
    logging: false,
  });
  const orm = orm1;
  await orm.authenticate();
  //   setupRelationship(orm);
  task = defineTask(orm);
  await orm.sync();
}
