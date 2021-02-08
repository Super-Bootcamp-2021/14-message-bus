const { read, write, del, updateStatus } = require('../lib/relationship');
const { ERROR_WORKER_NOT_FOUND } = require('../workers/worker');

const ERROR_DATA_TASK_MISSING = 'data task tidak lengkap';
const ERROR_DATA_TASK_INVALID = 'data task invalid';
const ERROR_WORKER_ID_INVALID = 'data pekerja invalid';
const ERROR_TASK_NOT_FOUND = 'task tidak ditemukan';
const INFO_TASK_WORKER_WAS_SUBMITTED =
  'task sudah diassigne ke pekerja tersebut';

async function registerTask(data) {
  if (!data.job || !data.status || !data.workerId || !data.document) {
    throw ERROR_DATA_TASK_MISSING;
  }
  const task = {
    job: data.job,
    status: data.status,
    assignee_id: data.workerId,
    document: data.document,
  };

  if (isNaN(data.workerId)) {
    throw ERROR_WORKER_ID_INVALID;
  }
  if (!['progress', 'cancel', 'done'].includes(data.status.toLowerCase())) {
    throw ERROR_DATA_TASK_INVALID;
  }

  let workers = await read('worker');
  var findWorker = workers.find((worker) => {
    return worker.id == data.workerId;
  });
  if (!findWorker) {
    throw ERROR_WORKER_NOT_FOUND;
  }

  let tasks = await read('task');
  var findTask = tasks.rows.find((taskData) => {
    return taskData.job == data.job && taskData.assignee_id == data.workerId;
  });
  if (findTask) {
    throw INFO_TASK_WORKER_WAS_SUBMITTED;
  }
  await write('task', task);
  return task;
}

async function listTask() {
  let tasks = await read('task');
  var filterTask = tasks.rows.filter((taskData) => {
    return taskData.status.toLowerCase() != 'cancel';
  });
  return filterTask;
}

async function updateStatusTask(data) {
  console.log(data);
  if (!data.id || !data.status) {
    throw ERROR_DATA_TASK_MISSING;
  }
  let tasks = await read('task');
  if (!tasks) {
    throw ERROR_TASK_NOT_FOUND;
  }
  if (!['progress', 'cancel', 'done'].includes(data.status.toLowerCase())) {
    throw ERROR_DATA_TASK_INVALID;
  }
  const idx = tasks.rows.findIndex((task) => task.id == data.id);
  if (idx === -1) {
    throw ERROR_TASK_NOT_FOUND;
  }
  await updateStatus(data.id, data.status);
  tasks = await read('task');
  const updated = tasks.rows[idx];
  return updated.job;
}

module.exports = {
  registerTask,
  listTask,
  updateStatusTask,
  ERROR_DATA_TASK_MISSING,
  ERROR_DATA_TASK_INVALID,
  ERROR_WORKER_ID_INVALID,
  ERROR_TASK_NOT_FOUND,
  INFO_TASK_WORKER_WAS_SUBMITTED,
};
