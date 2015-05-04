var express = require('express');
var app = express();
app.use(express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
var port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log('Server listening on port: ' + port);
});