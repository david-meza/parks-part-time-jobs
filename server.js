var http = require('http');
var url = require('url');
var fs = require('fs');
var server;

server = http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    fs.readFile(__dirname + path, function (err, data) {
        if (err) {
            return send404(res);
        }
        res.writeHead(200, {'Content-Type':path == 'json.js' ? 'text/javascript' : 'text/html'});
        res.write(data, 'utf8');
        res.end();
    });
}),
server.listen(8001);


var express = require('express');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.all("/agency.governmentjobs.com/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET");
    return next();
});

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname));

app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});