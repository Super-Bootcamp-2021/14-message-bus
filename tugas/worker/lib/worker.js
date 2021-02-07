const workerModel = require('../models/worker.model');
const ERROR_REGISTER_DATA_INVALID = 'Data registrasi pekerja tidak lengkap'
const ERROR_WORKER_NOT_FOUND = 'Data tidak ditemukan'

async function register(data){
    if (!data.name || !data.biografi || !data.address || !data.photo) {
        throw ERROR_REGISTER_DATA_INVALID;
    }

    const worker = {        // anggap bentuk data yang diperoleh dari model
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,
        biografi: data.biografi,
        photo: data.photo,
    }
    await workerModel.write(worker);
   
}

async function listWorker(){
    const result = await workerModel.read();
    const data = result.map(result =>result.dataValues);
    return data;
}

async function removeWorker(id) {
    const worker = await workerModel.findOne(id);

    if(!worker){
        throw ERROR_WORKER_NOT_FOUND;
    }
    const result = await workerModel.destroy(id);
    return result;
}

module.exports = {register,listWorker,removeWorker}