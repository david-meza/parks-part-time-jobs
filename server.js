var express = require('express');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname));

// set the home page route
app.get('/', function(req, res) {

  res.render('index');

});

app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});