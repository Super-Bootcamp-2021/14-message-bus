const { pub } = require('../lib/msgbus');

function registerSuccessLog(data) {
  const log = {
		time : Date.now(),
		data : data,
		success: true,
	} 
	pub('worker.register', JSON.stringify(log));
}

function registerErrorLog(data) {
  const log = {
		time : Date.now(),
		data : data,
		success: false,
	} 
	pub('worker.register', JSON.stringify(log));
}

function listSuccessLog(data) {
  const log = {
		time : Date.now(),
		data : data,
		success: true,
	} 
	pub('worker.list', JSON.stringify(log));
}

function listErrorLog(data) {
  const log = {
		time : Date.now(),
		data : data,
		success: false,
	} 
	pub('worker.list', JSON.stringify(log));
}

function removeSuccessLog(data) {
  const log = {
		time : Date.now(),
		data : data,
		success: true,
	} 
	pub('worker.remove', JSON.stringify(log));
}

function removeErrorLog(data) {
  const log = {
		time : Date.now(),
		data : data,
		success: false,
	} 
	pub('worker.remove', JSON.stringify(log));
}

module.exports = {
  registerErrorLog,
	registerSuccessLog,
  listErrorLog,
	listSuccessLog,
  removeErrorLog,
	removeSuccessLog,
};
