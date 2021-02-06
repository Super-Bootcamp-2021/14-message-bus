
const { Writable } = require('stream');
const readPerformanceData = require('./performance');

async function showWorkerPerformance(req, res) {
  try {
    const performance = await readPerformanceData();
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(performance));
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

module.exports = { showWorkerPerformance };
