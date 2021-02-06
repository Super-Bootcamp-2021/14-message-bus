const { getConnection } = require('typeorm');

async function writeWorker(data) {
  if (
    !data.name ||
    !data.alamat ||
    !data.biografi ||
    !data.email ||
    !data.photo ||
    !data.telepon
  ) {
    return 'data pekerja tidak lengkap';
  }

  const worker = getConnection().getRepository('Worker');
  const create = worker.create(data);
  await worker.save(create);
  return 'data pekerja berhasil disimpan.';
}

async function readWorker() {
  const worker = getConnection().getRepository('Worker');
  let workers = await worker.find();
  return JSON.stringify(workers);
}

async function deleteWorker(id) {
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from('Worker')
    .where(' id = :id', { id })
    .execute();
}

module.exports = {
  writeWorker,
  readWorker,
  deleteWorker,
};
