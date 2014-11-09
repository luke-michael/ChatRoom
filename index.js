var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var cache = {};

var server = http.createServer(function(request, response) {
    var filePath = false;
    var absPath = './';

    if(request.url == '/') {
       filePath = 'public/index.html';
    }
    else {
       filePath = 'public' + request.url;
    }

    absPath = absPath + filePath;

    serveStatic(response, cache, absPath);
});

function send404(response) {
    response.writeHead(404, {'Content-Type' : 'text/plain'});
    response.write('Error 404: Resource not found');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(200, {'Content-Type' : mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if(cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    }
    else {
        fs.exists(absPath, function (exists) {
            if(exists) {
            fs.readFile(absPath, function (err, data) {
                if (err) {
                    send404(response);
                }
                cache[absPath] = data;
                sendFile(response, absPath, data);
            });
        }
            else {
                send404(response);
            }
        });
    }
}

server.listen(3001, function(){
    console.log("Application started on port 3001");
});

var chatServer = require('./lib/chat_server.js');
chatServer.listen(server);