const { summary} = require('../lib/performance');


//get data worker
async function getSummary(req, res) {

    const data = await summary();

    const message = JSON.stringify({
        status: 'success',
        message: 'success get data',
        data: data,
    })

    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    res.write(message)
    res.end()
    
}




module.exports = { getSummary }
