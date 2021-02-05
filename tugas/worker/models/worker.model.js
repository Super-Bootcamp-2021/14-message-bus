const { defineWorker } = require('../../database/relational/migrations/worker.migration')
const { connection } = require('../../database/relational/connection')

const workers = defineWorker(connection)

async function write(data) {
    const result = await workers.create(data);
    return result;
}

async function read() {
    const result = await workers.findAll()
    return result;
}

async function destroy(id) {
    const result = await workers.destroy({
        where: {
            id: id,
        },
    })
    return result;
}

module.exports = { write,read,destroy }
