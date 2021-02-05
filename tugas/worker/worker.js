const workerModel = require('./worker.model');

const ERROR_REGISTER_DATA_INVALID = 'data registrasi pekerja tidak lengkap';
const ERROR_WORKER_NOT_FOUND = 'pekerja tidak ditemukan';

/**
 * Worker type definition
 * @typedef {Object} WorkerData
 * @property {[string]} id
 * @property {string} name
 * @property {number} age
 * @property {string} bio
 * @property {string} address
 * @property {string} photo
 */

function rowToData(worker) {
  return {
    id: worker.id,
    name: worker.name,
    age: worker.age,
    bio: worker.bio,
    address: worker.address,
    photo: worker.photo,
  };
}

/**
 * register new worker
 * @param {WorkerData} data worker profile
 * @returns {Promise<Worker>} new worker profile with id
 */
async function register(data) {
  if (!data.name || !data.age || !data.bio || !data.address || !data.photo) {
    throw ERROR_REGISTER_DATA_INVALID;
  }
  const worker = await workerModel.model.create({
    name: data.name,
    age: parseInt(data.age, 10),
    bio: data.bio,
    address: data.address,
    photo: data.photo,
  });
  return rowToData(worker);
}

/**
 * get list of registered workers
 * @returns {Promise<Worker[]>} list of registered workers
 */
async function list() {
  const res = await workerModel.model.findAndCountAll();
  return res.rows.map((row) => rowToData(row));
}

/**
 * remove a worker by an id
 * @param {string} id worker id
 * @returns {Promise<Worker>} removed worker
 */
async function remove(id) {
  const worker = await workerModel.model.findByPk(id);
  if (!worker) {
    throw ERROR_WORKER_NOT_FOUND;
  }
  await worker.destroy();
  return rowToData(worker);
}

module.exports = {
  register,
  list,
  remove,
  ERROR_REGISTER_DATA_INVALID,
  ERROR_WORKER_NOT_FOUND,
};
