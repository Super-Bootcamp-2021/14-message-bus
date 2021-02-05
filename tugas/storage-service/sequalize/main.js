/* eslint-disable no-unused-vars */
const { Sequelize } = require('sequelize');
const path = require('path');
const { defineTask, defineWorker } = require('./model');

let task, worker;

/**
 * setup relation ship
 * @param {Sequelize} orm sequalize instance
 */
function setupRelationship(orm) {
    worker = defineWorker(orm);
    task = defineTask(orm);

    task.belongsTo(worker, {
        onDelete: 'cascade',
        foreignKey: 'assigneeId',
  });
}

async function init() {
    const orm = new Sequelize('tugas13', 'root', '', {
        host: 'localhost',
        port: 3306,
        dialect: 'mariadb',
        logging: false,
    });
  
    await orm.authenticate();
    setupRelationship(orm);
    await orm.drop({ cascade: true });
    await orm.sync({ force: true, alter: true });
}

async function writeData() {
    const budi = await worker.create(
        { nama: 'ilham', email: 'ilham@mail.com', telepon: '097848', alamat: 'bangkalan', biografi: 'ini biografi'}    
    ); 
    const susi = await worker.create(
        { nama: 'susi' , email: 'susi@yahoo.com', telepon: '0980'  , alamat: 'surabaya' , biografi: 'biografi susi'}
    );

    await task.bulkCreate([
        { assigneeId: budi.id, job: 'makan' },
        { assigneeId: susi.id, job: 'minum' },
        { assigneeId: budi.id, job: 'belajar' },
    ]);
}

async function readData() {
    const res = await task.findAndCountAll({
        include: worker,
    });
    
    console.log('number of tasks ', res.count);
    for (const row of res.rows) {
        console.log({
            id: row.id,
            job: row.job,
            done: row.done,
            worker: {
                id: row.worker.id,
                nama: row.worker.nama,
            },
        });
    }
}

async function deleteData(id) {
    await worker.destroy({
        where: {
            id: id
        }
    })
}

async function updateData(id) {
    const result = await worker.update(
        { email: 'jos@gmail.com' },
        { 
            where: {
                id: id
            }
        }
    )
}
async function main() {
  await init();
  await writeData();
  await readData();
  await deleteData(2);
  await updateData(1);
}

// module.exports = {
//   writeData,
//   readData,
//   deleteData
// };
main();