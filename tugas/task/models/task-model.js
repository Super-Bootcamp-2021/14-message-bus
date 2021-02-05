const { defineTask } = require('../../database/relational/migrations/task');
const { defineWorker } = require('../../database/relational/migrations/worker.migration');

const { connection } = require('../../database/relational/connection');

const task = defineTask(connection);
const worker = defineWorker(connection);
task.belongsTo(worker, {
      onDelete: 'cascade',
      foreignKey: 'assignee_id',
});

async function write(data) {
    const result = await task.create(data);
    return result;
}

async function read() {
    const result = await task.findAll({
          include:worker
    })
    return result;
}

async function destroy(id) {
    const result = await task.update(
    { isDeleted: true },{
        where: {
            id: id,
        },
    })
    return result;
}

async function finish(id) {
      const result = await task.update(
      { isCompleted: true },{
          where: {
              id: id,
          },
      })
      return result;
}


module.exports = { write,read,destroy,finish }
