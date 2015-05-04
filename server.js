var express = require('express');
var app = express();
app.use('/app', express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.get('/', function(req, res) {
  res.redirect('/app/#/home');
});
var port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log('Server listening on port: ' + port);
});