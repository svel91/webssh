var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var qs = require('querystring')
var nodeRoot = path.dirname(require.main.filename)
var configPath = path.join(nodeRoot, 'config.json')
var config = require('read-config')(configPath)
 
// Create server
http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "./template" + q.pathname;
  if(filename=="./template/") {
    filename = "./template/index.html"
  } 
  if (req.method == 'POST') {
    var body = '';
    var post;
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var returnStr = '';
        post = qs.parse(body); 
        if(post.type == 'login') {
        	getCredential(post,function(transaction){
	            console.log(transaction);
	            returnStr = JSON.stringify(transaction);
	            res.writeHead(200, {'Content-Type': 'text/html'});
	            res.end(returnStr);
	        });
        }
    }); 
  } else {
    var extname = path.extname(filename);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
    }
    fs.readFile(filename, function(err, data) {
      if (err) {
        console.log(err);
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      } 
      res.writeHead(200, {'Content-Type': contentType});
      res.write(data);
      return res.end();
    });
  }

  
}).listen(8080); 


function getCredential(post,callback)  {
	var username = post.username;
	var password = post.password;
	if(config.user.name == username && config.user.password == password){
		result = 'http://'+username+':'+password+'@'+config.listen.ip+':'+config.listen.port+'/ssh/host/'+post.host;
	}else{
		result = 'Failed';
	}
	callback(result);
}