var express = require('express');
var service = express();
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;
service.listen(port, function() {
  console.log('SkilletHub Users service running on port: ', port);
});

service.use(bodyParser.urlencoded());

var usersRouter = require('./routes.js');
service.use('/user', usersRouter);

module.exports = service;