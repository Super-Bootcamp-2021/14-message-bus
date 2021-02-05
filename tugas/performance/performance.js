const { read, save } = require('../lib/kv');

async function taskLog(data) {
  let taskLogs = await read(data);
  if (!taskLogs) {
    taskLogs = 0;
  }

  const newTaskLogs = taskLogs + 1;
  await save(data, newTaskLogs);
  return newTaskLogs;
}

async function listTask() {
  let tasks = await read('task.created');
  if (!tasks) {
    tasks = 0;
  }

  const result = { 'task.created': tasks };
  return result;
}

async function listTaskDone() {
  let tasks = await read('task.done');
  if (!tasks) {
    tasks = 0;
  }

  const result = { 'task.done': tasks };
  return result;
}

async function listTaskCancel() {
  let tasks = await read('task.cancel');
  if (!tasks) {
    tasks = 0;
  }

  const result = { 'task.cancel': tasks };
  return result;
}

module.exports = {
  taskLog,
  listTask,
  listTaskDone,
  listTaskCancel,
};
