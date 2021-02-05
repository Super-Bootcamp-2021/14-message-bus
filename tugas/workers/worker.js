const { read, write, del } = require('../lib/relationship');

const ERROR_REGISTER_DATA_INVALID = 'data registrasi pekerja tidak lengkap';
const ERROR_WORKER_NOT_FOUND = 'pekerja tidak ditemukan';

async function register(data) {
  if (
    !data.name ||
    !data.email ||
    !data.telephone ||
    !data.biography ||
    !data.address ||
    !data.photo
  ) {
    throw ERROR_REGISTER_DATA_INVALID;
  }
  const worker = {
    name: data.name,
    address: data.address,
    email: data.email,
    telephone: data.telephone,
    biography: data.biography,
    photo: data.photo,
  };
  await write('worker', worker);
  return worker;
}

async function list() {
  let workers = await read('worker');
  if (!workers) {
    workers = [];
  }
  return workers;
}

async function remove(id) {
  let workers = await read('worker');
  if (!workers) {
    throw ERROR_WORKER_NOT_FOUND;
  }
  const idx = workers.findIndex((w) => w.id === id);
  if (idx === -1) {
    throw ERROR_WORKER_NOT_FOUND;
  }
  const deleted = workers[idx];
  await del('worker', id);
  return deleted;
}

module.exports = {
  register,
  list,
  remove,
  ERROR_REGISTER_DATA_INVALID,
  ERROR_WORKER_NOT_FOUND,
};
