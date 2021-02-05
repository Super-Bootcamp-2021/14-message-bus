const {connection} = require('../connection');
const {defineWorker} = require('./worker.migration');
const {defineTask} = require('./task');




async function migrate(){
    await connection.authenticate();
    const worker = defineWorker(connection);
    const task = defineTask(connection);

    task.belongsTo(worker, {
        onDelete: 'cascade',
        foreignKey: 'assignee_id',
    });


    connection.sync({force: true});
}

migrate();
