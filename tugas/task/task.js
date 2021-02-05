const { getConnection } = require('typeorm');

async function writeTask(data) {
  if (!data.job || !data.assignee) {
    return 'data pekerjaan tidak lengkap';
  }

  const task = getConnection().getRepository('Task');
  const create = task.create(data);
  await task.save(create);
  return 'data pekerjaan berhasil disimpan.';
}

async function readTask() {
  const task = getConnection().getRepository('Task');
  let jobs = await task.find({ relations: ['assignee'] });
  return JSON.stringify(jobs);
}

async function readTaskDone() {
  const task = getConnection().getRepository('Task');
  let jobs = await task.find({
    where: { done: true },
    relations: ['assignee'],
  });
  return JSON.stringify(jobs);
}

async function readTaskCancelled() {
  const task = getConnection().getRepository('Task');
  let jobs = await task.find({
    where: { cancel: true },
    relations: ['assignee'],
  });
  return JSON.stringify(jobs);
}

async function updateTask(data, id) {
  await getConnection()
    .createQueryBuilder()
    .update('Task')
    .set(data)
    .where(' id = :id', { id })
    .execute();
}

module.exports = {
  writeTask,
  readTask,
  updateTask,
  readTaskDone,
  readTaskCancelled,
};
