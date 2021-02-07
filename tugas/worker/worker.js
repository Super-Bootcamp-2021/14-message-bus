const { getConnection } = require('typeorm');
const { Worker } = require('./worker.model');

const ERROR_REGISTER_DATA_INVALID = 'data registrasi pekerja tidak lengkap';
const ERROR_WORKER_NOT_FOUND = 'pekerja tidak ditemukan';

/**
 * register new worker
 */
async function register(data) {
  if (!data.name || !data.email || !data.nohp || !data.address || !data.bio ) {
    throw ERROR_REGISTER_DATA_INVALID;
  }
  const workerRepo = getConnection().getRepository('Worker');
  const worker = new Worker(
    null,
    data.name,
    data.email,
    data.nohp,
    data.address,
    data.bio,
    data.photo,
  );
  await workerRepo.save(worker);
  return worker;
}

/**
 * get list of registered workers
 */
function list() {
  const workerRepo = getConnection().getRepository('Worker');
  return workerRepo.find();
}

/**
 * remove a worker by an id
 */
async function remove(id) {
  const workerRepo = getConnection().getRepository('Worker');
  const worker = await workerRepo.findOne(id);
  if (!worker) {
    throw ERROR_WORKER_NOT_FOUND;
  }
  await workerRepo.delete(id);
  return worker;
}

module.exports = {
  register,
  list,
  remove,
  ERROR_REGISTER_DATA_INVALID,
  ERROR_WORKER_NOT_FOUND,
};
