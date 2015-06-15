
var sio        = require('socket.io');
var http       = require('http');
var content    = require('node-static');

var commServer = require('./graffeine/command');
var graffeine  = require('./graffeine/common');

graffeine.log('Starting Graffeine server');

var www = new(content.Server)('../' + graffeine.config.server.docRoot);
var srv = http.createServer(graffeine.handler(www));
srv.listen(graffeine.config.server.port);

graffeine.log('Open browser to http://127.0.0.1:' + graffeine.config.server.port);
graffeine.log('Starting WS server on ' + graffeine.config.server.port);

var ws = srv.listen(graffeine.config.server.port);
var conn = sio.listen(ws, { log: false });

conn.sockets.on('connection', function (socket) { 

    var command = new commServer(socket);
    graffeine.log('Got connection');

    socket.on('graph-init',    command.graphInitialise);
    socket.on("graph-delete",  command.graphDelete);
    socket.on('graph-stats',   command.graphStatistics);
    socket.on('graph-fetch',   command.graphFetch);
    socket.on('node-join',     command.nodesJoin);
    socket.on('node-add',      command.nodeAdd);
    socket.on('node-update',   command.nodeUpdate);
    socket.on('node-find',     command.nodeFind);
    socket.on('node-delete',   command.nodeDelete);
    socket.on('nodes-orphans', command.nodesOrphans);
    socket.on('path-delete',   command.relDelete);

});
