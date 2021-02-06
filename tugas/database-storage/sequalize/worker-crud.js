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
  // await orm.drop({ cascade: true });
  // await orm.sync({ force: true, alter: true });
}

init();

async function writeWorker({ nama, email, telepon, alamat, biografi, foto }) {
  const result = await worker.create({
    nama: nama,
    email: email,
    telepon: telepon,
    alamat: alamat,
    biografi: biografi,
    foto: foto
  });

  return JSON.stringify(result.dataValues);
}

async function readWorker() {
  const result = await worker.findAndCountAll();

  return JSON.stringify(result.rows);
}

async function deleteWorker(id) {
  const result = await worker.destroy({
    where: {
      id: id,
    },
  });
  return result.toString();
}

async function updateWorker({ id, nama, email, telepon, alamat, biografi, foto }) {
  const result = await worker.update(
    {
      nama: nama,
      email: email,
      telepon: telepon,
      alamat: alamat,
      biografi: biografi,
      foto: foto
    },
    {
      where: {
        id: id,
      },
    }
  );
  return result[0].toString();
}

module.exports = {
  writeWorker,
  readWorker,
  updateWorker,
  deleteWorker,
};

//writeWorker({ nama: 'ilham', email: 'ilham@mail.com', telepon: '097848', alamat: 'bangkalan', biografi: 'ini biografi'});
//updateWorker({ id: 8, nama: 'junior', email: 'ilham@mail.com', telepon: '097848', alamat: 'bangkalan', biografi: 'ini biografi'});
