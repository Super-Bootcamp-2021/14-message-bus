const { pub } = require('../lib/msgbus');

async function registerSuccessLog(data) {
  const log = {
		time : Date.now(),
		data : data,
		success: true,
	} 
	await pub('worker.register', JSON.stringify(log));
  return;
}

async function registerErrorLog(data) {
  const log = {
		time : Date.now(),
		data : data,
		success: false,
	} 
	await pub('worker.register', JSON.stringify(log));
  return;
}

async function listSuccessLog(data) {
  const log = {
		time : Date.now(),
		data : data,
		success: true,
	} 
	await pub('worker.list', JSON.stringify(log));
  return;
}

async function listErrorLog(data) {
  const log = {
		time : Date.now(),
		data : data,
		success: false,
	} 
	await pub('worker.list', JSON.stringify(log));
  return;
}

async function removeSuccessLog(data) {
  const log = {
		time : Date.now(),
		data : data,
		success: true,
	} 
	await pub('worker.remove', JSON.stringify(log));
  return;
}

async function removeErrorLog(data) {
  const log = {
		time : Date.now(),
		data : data,
		success: false,
	} 
	await pub('worker.remove', JSON.stringify(log));
  return;
}

module.exports = {
  registerErrorLog,
	registerSuccessLog,
  listErrorLog,
	listSuccessLog,
  removeErrorLog,
	removeSuccessLog,
};
