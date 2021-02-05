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

async function writeTask({ assignee_id, job, attachment, done }) {    
    const result = await task.create(
        { assignee_id: assignee_id, job: job, attachment: attachment, done: done }
    );        
    
    return JSON.stringify(result.dataValues);
}

async function readTask() {    
    const result = await task.findAndCountAll();
    
    return JSON.stringify(result.rows);
}

async function deleteTask(id) {    
    const result = await task.destroy({
        where: {
            id: id
        }
    });
    return result.toString();
}

async function updateTask({ id, job, attachment, done }) {    
    const result = await task.update(
        { 
            job: job, 
            done: done,
            attachment: attachment
        },
        { 
            where: {
                id: id
            }
        }
    );
    return result[0].toString();
}

async function doneTask({ id, done }) {    
    const result = await task.update(
        {             
            done: done,            
        },
        { 
            where: {
                id: id
            }
        }
    );
    return result[0].toString();
}
// async function main() {
  
  //await writeTask({id: 1, job: 'ngoding', done: true});
//   await updateTask({id: 1, job: 'bermain', done: true});
//   await readTask();
//   await updateTask(1);
//   await deleteTask(1);  
// }

module.exports = {
    writeTask,
    readTask,
    updateTask,
    deleteTask,
    doneTask
};
// main();