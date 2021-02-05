const { createServer } = require("http");
const url = require("url");

const { stdout } = require("process");
// const { 
//     uploadService,
//     readService,
//     deleteService 
// } = require("./service/upload-service");
const Busboy = require('busboy');
const {
    writeWorker,
    readWorker,
    updateWorker,
    deleteWorker
} = require("./sequalize/worker-crud");

const {
    writeTask,
    readTask,
    updateTask,
    deleteTask,
    doneTask
} = require("./sequalize/task-crud");

inspect = require('util').inspect;

const server = createServer(async (req, res) => {
    let method = req.method;

    // route
    let message = "404 not found";
    let statusCode = 200;
    
    // const respond = () => {
    //     res.statusCode = statusCode;
    //     res.write(message);
    //     res.end();
    // };

    const uri = url.parse(req.url, true);
    
    switch (true) {
        case /^\/worker\/write/.test(uri.pathname):
            // console.log(req.headers);
            if (method === 'GET') {

                let data = { nama: 'ilham', email: 'ilham@mail.com', telepon: '097848', alamat: 'bangkalan', biografi: 'ini biografi'};

                message = await writeWorker(data);                
                res.setHeader('Content-Type', 'application/json');         
            } else {
                message = 'Method tidak tersedia';                      
            }
            break;            
        case /^\/worker\/update/.test(uri.pathname):
            if (method === 'GET') {
                let data = { 
                    id: 20, 
                    nama: 'junior', 
                    email: 'junior@mail.com', 
                    telepon: '097848', 
                    alamat: 'bangkalan', 
                    biografi: 'ini biografi'
                }
                message = await updateWorker(data);
            } else {
                message = 'Method tidak tersedia';                
            }
            break;
        case /^\/worker\/read/.test(uri.pathname):
            if (method === 'GET') {
                message = await readWorker();
                res.setHeader('Content-Type', 'application/json');         
            } else {
                message = 'Method tidak tersedia';                
            }
            break;
        case /^\/worker\/delete/.test(uri.pathname):
            if (method === 'GET') {
                message = await deleteWorker(uri.query["id"]);
            } else {
                message = 'Method tidak tersedia';                                
            }            
            break;        
        case /^\/task\/write/.test(uri.pathname):            
            if (method === 'GET') {
                // let data = {
                //     assignee_id: 19, job: 'ngoding', done: true
                // };                
                message = await writeTask(JSON.parse(uri.query['data']));                
                res.setHeader('Content-Type', 'application/json');
            } else {
                message = 'Method tidak tersedia';                      
            }
            break;            
        case /^\/task\/read/.test(uri.pathname):            
            if (method === 'GET') {                       
                message = await readTask();
                res.setHeader('Content-Type', 'application/json');         
            } else {
                message = 'Method tidak tersedia';                      
            }
            break;            
        case /^\/task\/update/.test(uri.pathname):            
        
            if (method === 'GET') {                           
                let data = { assignee_id: 19, job: 'bermain', done: true }
                message = await updateTask(data);
            } else {
                message = 'Method tidak tersedia';                      
            }
            break;            
        case /^\/task\/delete/.test(uri.pathname):            
        
            if (method === 'GET') {                           
                let id = 3;
                message = await deleteTask(id);
            } else {
                message = 'Method tidak tersedia';                      
            }
            break;       
        case /^\/task\/done/.test(uri.pathname):                    
            if (method === 'GET') {                                           
                message = await doneTask(JSON.parse(uri.query['data']));
            } else {
                message = 'Method tidak tersedia';                      
            }
            break;        
        default:
            statusCode = 404;                        
            break;
    }

    res.statusCode = statusCode;
    res.write(message);
    res.end();
});

const PORT = 6000;
server.listen(PORT, () => {
    stdout.write(`server listening on port ${PORT}`);
})