const { addWorker, getWorker } = require('./peformance');
const { subscriber, getResult } = require('../lib/nats');

subscriber('worker.added');
/**
 * service to get total of workers
 */
async function totalWorkerService(req, res) {
  try {
    let worker = getResult();
    const workers = await addWorker('worker.added', worker);
    res.setHeader('content-type', 'application/json');
    const message = JSON.stringify(workers);
    res.write(message);
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

/**
 * service to get total of tasks
 */
async function totalTaskService(req, res) {
  try {
    // const workers = await list();
    res.setHeader('content-type', 'application/json');
    // const message = JSON.stringify(workers);
    // res.write(message);
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

/**
 * service to get total of done tasks
 */
async function totalDoneService(req, res) {
  try {
    // const workers = await list();
    res.setHeader('content-type', 'application/json');
    // const message = JSON.stringify(workers);
    // res.write(message);
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

/**
 * service to get total of cancel tasks
 */
async function totalCancelService(req, res) {
  try {
    // const workers = await list();
    res.setHeader('content-type', 'application/json');
    // const message = JSON.stringify(workers);
    // res.write(message);
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

module.exports = {
  totalWorkerService,
  totalTaskService,
  totalDoneService,
  totalCancelService,
};
