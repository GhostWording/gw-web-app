#!/usr/bin/env node

var util = require('util'),
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    events = require('events');

var DEFAULT_PORT = 8000;
var MimeMap = {
  'txt': 'text/plain',
  'html': 'text/html',
  'css': 'text/css',
  'xml': 'application/xml',
  'json': 'application/json',
  'js': 'text/javascript',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'png': 'image/png',
  'svg': 'image/svg+xml'
};
function escapeHtml(value) {
  return value.toString().
    replace('<', '&lt;').
    replace('>', '&gt;').
    replace('"', '&quot;');
}

http.createServer(function(req,res){

	var requestUrl = url.parse(req.url).pathname;
	util.puts('Http Server running at http://localhost:' + DEFAULT_PORT + '/');

	util.puts(req.method + ' : ' + requestUrl);

	if(requestUrl.match(/(assets|scripts|views|controllers|services).*/))
	{
		

	    //var file = fs.createReadStream("." + requestUrl);
	    if (req.method === 'HEAD') {
		    res.end();
		  } else {
			util.puts( MimeMap[requestUrl.split('.').pop()]);
	    	
		  	fs.readFile('.' + requestUrl,function(e,c){
		  		res.writeHead(200, {
			   	 'Content-Type': MimeMap[requestUrl.split('.').pop()]
			  	});
				res.end(c.toString());

			});
		  }
	} 

	res.writeHead(200, {
		    'Content-Type': 'text/html'
		  });

	fs.readFile('./index.html',function(e,c){
		res.end(c.toString());

	});

}).listen(DEFAULT_PORT,"127.0.0.1");