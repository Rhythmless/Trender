var restApi   = require('./RestApi'),
    express   = require('express');
var port = process.env.PORT || 3000;

// start web server
console.log("[main.js] starting web server");
var app = express();
app.use('/api', restApi);
app.use(express.static('static'));
var server = app.listen(port, function () {
    console.log("[main.js] listening on", server.address());
});