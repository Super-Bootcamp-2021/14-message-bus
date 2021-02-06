const { readStoreMessage } = require('../lib/kv');


async function readPerformanceData(){
    const worker = await readStoreMessage('workers-total');
    const taskDone = await readStoreMessage('tasks-done');
    const taskTotal = await readStoreMessage('tasks-total');
    const taskDropped = await readStoreMessage('tasks-dropped');
    
    
    let performance = await {
        'Worker Ammount': '',
        'Total Task': '',
        'Total Task Done': '',
        'Total Task Dropped': '',
      };
    
    
    performance['Worker Ammount'] = await worker;
    performance['Total Task'] = await taskTotal;
    performance['Total Task Done'] = await taskDone;
    performance['Total Task Dropped'] = await taskDropped;
    
    return performance
}


module.exports = readPerformanceData