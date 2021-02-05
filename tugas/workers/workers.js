/* eslint-disable no-unused-vars */
const { Sequelize } = require('sequelize');
const path = require('path');
const { defineWorker } = require('./model');
const { task } = require('./task/task.js');

let worker;

/**
 * setup relation ship
 * @param {Sequelize} orm sequalize instance
 */
function setupRelationship(orm) {
  worker = defineWorker(orm);

  task.belongsTo(worker, {
    onDelete: 'cascade',
    foreignKey: 'assigneeName',
  });
}

async function create(data) {
  if (!data.job) {
    throw ERROR_CREATE_DATA_INVALID;
  }

  const worker = {
    name: data.name,
    adress: data.adress,
    email: data.email,
    notelp: data.notelp,
    biografi: data.biografi,
  };

  await main(worker);
  return worker;
}

async function writeData() {
  let data = {
    nama: uri.query['nama'],
    alamat: uri.query['alamat'],
    email: uri.query['email'],
    telepon: uri.query['telepon'],
    bigorafi: uri.query['biografi'],
  };
  await task.bulkCreate([
    { assigneeName: budi.id, job: task.job.toString() },
    { assigneeName: budi.id, attachment: task.attachment.toString() },
    { assigneeName: budi.id, done: task.attachment.toString() },
    { assigneeName: budi.id, cancel: task.cancel.toString() },
  ]);
}

// async function readData() {
//   const res = await task.findAndCountAll({
//     include: worker,
//   });
//   console.log('number of tasks ', res.count);
//   for (const row of res.rows) {
//     console.log({
//       id: row.id,
//       job: row.job,
//       done: row.done,
//       worker: {
//         id: row.worker.id,
//         name: row.worker.name,
//       },
//     });
//   }
// }

async function main() {
  await setupRelationship();
  await create();
  await readData();
}

module.exports = {
  main,
  setupRelationship,
  create,
  writeData,
  // readData
};
