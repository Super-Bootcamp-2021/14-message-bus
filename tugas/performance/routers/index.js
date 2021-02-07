const url = require('url')
const performanceRoutes = require('./performance.route');



function main(req, res){
    let message = 'tidak ditemukan data';
    let statusCode = 200;
    const uri = url.parse(req.url, true);

    const respond = async () => {
      res.statusCode = 404;
      res.write(message);
      res.end();
    };

    if(uri.pathname.includes('/summary')){
        performanceRoutes(req, res); 
        return
    }
  

    respond()
    // workers routes
}

module.exports = main