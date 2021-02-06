const { createServer } = require('http');
const url = require('url');

const { stdout } = require('process');
const {
   uploadService,   
   deleteService
} = require("../object-storage/storage-service");


const  {
   createWorker
} = require("./worker-service");

const {
   writeWorker,
   readWorker,
   updateWorker,
   deleteWorker,
 } = require("../database-storage/sequalize/worker-crud");

const server = createServer(async (req, res) => {
   let method = req.method;

   let message = '404 not found';
   let statusCode = 200;

   const respond = () => {
      res.statusCode = statusCode;
      res.write(message);
      res.end();
   };

   const uri = url.parse(req.url, true);

   switch (true) {
      case /^\/create/.test(uri.pathname):      
         if (method === 'POST') {                
            let data = {};
         
            createWorker(req, res)
               .then((result) => {
                  data = result;              
               });

            uploadService(req, res)
               .then(result => {
                  data['foto'] = result;
               })
               .then(async () => {
                  return await writeWorker(data);
               })
               .then((val) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.write(val);
                  res.end();
               });                           
         } else {
         respond();
         }
         break;      

      case /^\/read\/worker/.test(uri.pathname):
         if (method === 'GET') {
            message = "await readWorker()";
            res.setHeader('Content-Type', 'application/json');
         } else {
            respond();
         }
         break;
         
      case /^\/delete\/\w+/.test(uri.pathname):
         if (method === 'GET') {
            message = await deleteService(req);
            res.write(message.toString());            
            res.end();
         } else {
            message = 'Method tidak tersedia';
         }
         break;
    
      default:
         statusCode = 404;
         respond();
         break;
  }  
});

const PORT = 7000;
server.listen(PORT, () => {
  stdout.write(`server listening on port ${PORT}`);
});
