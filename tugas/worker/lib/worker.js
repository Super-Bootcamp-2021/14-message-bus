const { write,read,destroy } = require('../models/worker.model');

async function register(data){
    try {
        const worker = {        // anggap bentuk data yang diperoleh dari model
            name: data.name,
            address: data.address,
            email: data.email,
            phone: data.phone,
            biografi: data.biografi,
            photo: data.photo,
        }
        await write(worker);
        return;
    } catch (error) {
        throw error
    }
}

async function listWorker(){
    try {
        const result = await read();
        const data = result.map(result =>result.dataValues);
        return data;
    } catch (error) {
        throw error
    }
}

async function removeWorker(id) {
    try {
        const result = await destroy(id);
        return result;

    } catch (error) {
        throw error
    }
}

module.exports = {register,listWorker,removeWorker}