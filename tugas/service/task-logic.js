const { writeDataTask, readDataTask, updateData } = require('../database/typeorm/main');

const ERROR_REGISTER_DATA_INVALID = 'data registrasi pekerja tidak lengkap';
const ERROR_WORKER_NOT_FOUND = 'pekerja tidak ditemukan';

async function register(data) {
    if (!data.job || !data.detail || !data.attach || !data.assignee ) {
        throw ERROR_REGISTER_DATA_INVALID;
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
    try{
    const task = await updateData(id,1);
    return task;
    }catch(err){
        throw err;
    }
}
//status 0 merupakan task batal
async function taskBatal(id) {
    try {
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
}; 