var http = require('http');
//var gettingFunctions = require('./GettingFunctions');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});

  /*gettingFunctions.getFinalData().then(function (data) {
  	res.end('Got the Data!\n'); // this will FAIL travis ci lint
  });*/

  res.end('Got the Data!\n'); // this will FAIL travis ci lint
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');