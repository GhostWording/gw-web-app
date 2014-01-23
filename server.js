var express = require("express");
var app = express();
var util = require('util');

app.configure(function(){
    app.use(express.static(__dirname + '/dist'));
});

app.get('/assets/*',function(req,res,next){
    util.puts('File: ' + req.url);
    res.sendfile(__dirname + '/build' + req.url);
});

app.get('/scripts/*',function(req,res,next){
    util.puts('File: ' + req.url);
    res.sendfile(__dirname + '/build' + req.url);
});

app.get('/views/*',function(req,res,next){
    util.puts('File: ' + req.url);
    res.sendfile(__dirname + '/build' + req.url);
});

app.get("/*", function(req, res, next){
    util.puts('Path' + req.url);

    res.sendfile(__dirname + '/build/index.html');
});

app.listen(3000);

util.puts('server started on port 3000');
