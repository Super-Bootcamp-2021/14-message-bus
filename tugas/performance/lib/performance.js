const { createClient, getAsync} = require('../../database/key/redist');

async function summary(){
    const clientRed = createClient();
    const redisGet = getAsync(clientRed);
    const data = {
                    task : {
                        total: 0,
                        complete: 0,
                    },
                    worker : {
                       total:0
                    }
                }


    const keys = ['total.task','total.task.complete','total.worker'];
    
    for (let i = 0; i < keys.length; i++) {
        let result = JSON.parse(await redisGet(keys[i]));
        result = result == null ? 0 : result.value;
        switch (keys[i]) {
            case 'total.task':
                data.task.total =  parseInt(result);
                break;
            case 'total.task.complete':
                data.task.complete =  parseInt(result);
                break;
            case 'total.worker':
                data.worker.total = parseInt(result);
                break;
        
            default:
                break;
        }

        
    }

    return data;
    

}

module.exports = {summary}