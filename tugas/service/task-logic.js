const { writeDataTask, readDataTask, updateData, getonetask, getoneWorker } = require('../database/typeorm/main');

const ERROR_REGISTER_DATA_INVALID = 'data registrasi task tidak lengkap';
const ERROR_WORKER_NOT_FOUND = 'pekerja tidak ditemukan';
const ERROR_TASK_NOT_FOUND = 'task tidak ditemukan';

async function register(data) {
    if (!data.job || !data.detail || !data.attach || !data.assignee) {
        throw ERROR_REGISTER_DATA_INVALID;
    }
    const worker = await getoneWorker(data.assignee); // check assignee
    if (!worker) {
        throw ERROR_WORKER_NOT_FOUND;
    }
    //status task default adalah 2  == belum selesai
    const task = {
        job: data.job,
        detail: data.detail,
        attach: data.attach,
        assignee: data.assignee,
    };
    await writeDataTask(task);
    return task;
}

async function list() {
    const task = await readDataTask();
    return task;
}
// status 1 merupakan task selesai
async function taskSelesai(id) {
    try {
        const testTask = await getonetask(id);
        if (!testTask) {
            throw ERROR_TASK_NOT_FOUND;
        }
        const task = await updateData(id, 1);
        return task;
    } catch (err) {
        throw err;
    }
}
//status 0 merupakan task batal
async function taskBatal(id) {
    try {
        const testTask = await getonetask(id);
        if (!testTask) {
            throw ERROR_TASK_NOT_FOUND;
        }
        const task = await updateData(id, 0);
        return task;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    register,
    list,
    taskSelesai,
    taskBatal,
    ERROR_REGISTER_DATA_INVALID,
    ERROR_WORKER_NOT_FOUND,
    ERROR_TASK_NOT_FOUND
}; 