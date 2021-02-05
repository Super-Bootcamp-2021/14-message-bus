const {read, save}= require('../database/kv/kv');

async function registerLog(log){
    let logs = await read(log)
    if (!logs){
        logs = 0
    }
   logs = parseInt(logs) + 1;
   await save(log,logs)
   return logs
}
async function readlog(log){
    let logs = await read(log)
    if(!logs){
        throw "data masih kosong"
    }
    return logs
}


module.exports = {
    registerLog, readlog
}