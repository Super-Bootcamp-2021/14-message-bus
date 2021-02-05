/* eslint-disable no-unused-vars */
const { Sequelize } = require('sequelize');
const path = require('path');
const { defineTask } = require('../task/model');

let task;

// function setupRelationship(orm) {
//   worker = defineWorker(orm);
//   task = defineTask(orm);

//   task.belongsTo(worker, {
//     onDelete: 'cascade',
//     foreignKey: 'assigneeId',
//   });
// }

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

async function writeData(data) {
  await task.create({
    job: data.job,
    attachment: data.attachment,
    done: data.done,
    cancel: data.cancel,
  });
}

async function updateTask(data) {
  await task.update(
    {
      job: data.job,
      attachment: data.attachment,
      done: data.done,
      cancel: data.cancel,
    },
    {
      where: {
        id: data.id,
      },
    }
  );
}

async function readData(id) {
  const taskdb = await task.findAll({
    where: {
      id: id,
    },
  });

  return taskdb;
}

async function taskDone(data) {
  await task.update(
    {
      done: 1, //1 or true
    },
    {
      where: {
        id: data.id,
      },
    }
  );
}

async function taskCancel(data) {
  await task.update(
    {
      cancel: 1, //1 or true
    },
    {
      where: {
        id: data.id,
      },
    }
  );
}

async function main(data) {
  await init();
  await writeData(data);
}

async function updateDB(data) {
  await init();
  await updateTask(data);
}

async function doneDB(data) {
  await init();
  await taskDone(data);
}

async function cancelDB(data) {
  await init();
  await taskCancel(data);
}

async function dropTable() {
  await init();
  await task.drop();
}

async function read(id) {
  await init();
  const taskr = await readData(id);
  return taskr[0].dataValues;
}

module.exports = {
  main,
  updateDB,
  doneDB,
  cancelDB,
  init,
  dropTable,
  read,
};
