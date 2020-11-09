var express = require("express");
var app = express();
var util = require('util');
var colors = require('colors');

app.use(express.static(__dirname));

app.get('/assets/*',function(req, res, next) {
  util.debuglog('file: ' + req.url);
  res.sendFile(__dirname + req.url);
});

app.get('/scripts/*',function(req, res, next) {
  util.debuglog('file: ' + req.url);
  res.sendFile(__dirname + req.url);
});

app.get('/views/*',function(req, res, next) {
  util.debuglog('file: ' + req.url);
  res.sendFile(__dirname  + req.url);
});

app.get('/bower_components/*',function(req, res, next) {
  util.debuglog('file: ' + req.url);
  res.sendFile(__dirname  + req.url);
});

app.get("/*", function(req, res, next) {
  util.debuglog('path: ' + req.url);
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000);

util.debuglog('server started on port 3000'.blue);
