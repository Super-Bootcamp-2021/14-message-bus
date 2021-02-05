const ERROR_CREATE_DATA_INVALID = 'data pekerjaan tidak lengkap';
const ERROR_TASK_NOT_FOUND = 'pekerjaan tidak ditemukan';
const { main, updateDB, doneDB, cancelDB } = require('./test-database');

function create(data) {
  if (!data.job) {
    throw ERROR_CREATE_DATA_INVALID;
  }

  const task = {
    job: data.job,
    attachment: data.attachment,
    done: data.done,
    cancel: data.cancel,
  };

  main(task);
  return task;
}

function update(data) {
  const task = {
    id: data.id,
    job: data.job,
    attachment: data.attachment,
    done: data.done,
    cancel: data.cancel,
  };

  updateDB(task);
  return task;
}

function done(id) {
  const task = {
    id: id,
  };

  doneDB(task);
  return task;
}

function cancel(id) {
  const task = {
    id: id,
  };

  cancelDB(task);
  return task;
}

module.exports = {
  ERROR_CREATE_DATA_INVALID,
  ERROR_TASK_NOT_FOUND,
  create,
  update,
  done,
  cancel,
};
