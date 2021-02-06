const { readStoreMessage }  = require('../lib/kv')



async function showWorkerPerformance(req, res){    
    req.on('data', () => {
        const worker = await readStoreMessage('workers-total')
        const taskDone = await readStoreMessage('tasks-done')
        const taskTotal = await readStoreMessage('tasks-total')
        const taskDropped = await readStoreMessage('tasks-dropped')
        
        let performance = {
            "Worker Ammount" : worker,
            "Total Task" : taskTotal,
            "Total Task Done": taskDone,
            "Total Task Dropped" : taskDropped
        }
        return performance
    })
    req.on('end', (chunk) => {
        const result = JSON.parse(chunk)
        res.setHeader('content-type', 'application/json');
        res.write(JSON.stringify(result))
        res.end()
    })
}

module.exports = {showWorkerPerformance}