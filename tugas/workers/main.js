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
   insertWorker,
   selectWorker,
   deleteWorker,
   selectWorkerById
 } = require("./db-request");
const { worker } = require('cluster');

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
                  return await insertWorker(data);
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

      case /^\/read/.test(uri.pathname):
         if (method === 'GET') {
            message = await selectWorker();
            res.setHeader('Content-Type', 'application/json');
            res.write(message);
            res.end();
         } else {
            respond();
         }
         break;
         
      case /^\/delete/.test(uri.pathname):
         if (method === 'GET') {
            const detail_worker = await selectWorkerById(uri.query["id"]);
            const foto = JSON.parse(detail_worker).foto;
            deleteService(foto);                 
            message = await deleteWorker(uri.query["id"]);
            res.write(message);
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
