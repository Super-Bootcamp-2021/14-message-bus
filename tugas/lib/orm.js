const { Sequelize } = require('sequelize');
const { CONFIG } = require('./config');
const { defineTask } = require('../tasks/task.model');
const { defineWorker } = require('../worker/worker.model');

const ERROR_REGISTER_DATA_INVALID = 'data tidak lengkap';
const ERROR_DATA_NOT_FOUND = 'data tidak ditemukan';

exports.orm;
let task, worker;

function setupRelationship(orm) {
  worker = defineWorker(orm);
  task = defineTask(orm);

  task.belongsTo(worker, {
    onDelete: 'cascade',
    foreignKey: 'assigneeId',
  });
}

async function init() {
  const orm = new Sequelize(
    CONFIG.DATABASE,
    CONFIG.USERNAME,
    CONFIG.PASSWORD,
    CONFIG.DB_CONFIG
  );
  await orm.authenticate();
  setupRelationship(orm);
  await orm.sync({ alter: true });
}

async function writeData(data) {
  await worker.create(data);
  return data
}

async function removeData(data) {
  const workDel = await worker.findByPk(data);
  if (!workDel) {
    throw ERROR_DATA_NOT_FOUND;
  }
  await workDel.destroy();
  return workDel;
}

async function readData() {
  const { count, rows } = await worker.findAndCountAll();
  return { count, rows };
}

async function writeDataTask(data) {
  console.log(data);
  await task.create(data);
}

async function doneDataTask(data) {
  await task.update(
    {
      done: true,
    },
    {
      where: {
        id: data,
      },
    }
  );
  return await task.findByPk(data);
}

async function cancelDataTask(data) {
  await task.update(
    {
      cancel: true,
    },
    {
      where: {
        id: data,
      },
    }
  );
  return await task.findByPk(data);
}

async function readTask() {
  const { count, rows } = await task.findAndCountAll();
  return { count, rows };
}

async function removeTask(data) {
  const taskDel = await task.findByPk(data);
  if (!taskDel) {
    throw ERROR_DATA_NOT_FOUND;
  }
  await taskDel.destroy();
  return taskDel;
}

module.exports = {
  init,
  writeData,
  readData,
  removeData,
  writeDataTask,
  doneDataTask,
  cancelDataTask,
  readTask,
  removeTask,
  ERROR_REGISTER_DATA_INVALID,
  ERROR_DATA_NOT_FOUND,
};
