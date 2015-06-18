
var graffeine = require('./lib/graffeine');
var gutil = require("./lib/gutil");

gutil.log('Starting Graffeine Server');

graffeine.command.socket.on('connection', function (socket) { 

    gutil.log('socket: connection');

    socket.on('graph-init',    command.graphInitialise);
    socket.on("graph-delete",  command.graphDelete);
    socket.on('graph-stats',   command.graphStatistics);
    socket.on('graph-fetch',   command.graphFetch);
    socket.on('graph-load',    command.graphLoad);
    socket.on('graph-gists',   command.recv.graphGists);
    socket.on('node-join',     command.nodesJoin);
    socket.on('node-add',      command.nodeAdd);
    socket.on('node-update',   command.nodeUpdate);
    socket.on('node-find',     command.nodeFind);
    socket.on('node-delete',   command.nodeDelete);
    socket.on('nodes-orphans', command.nodesOrphans);
    socket.on('path-all',      command.pathAll);
    socket.on('path-delete',   command.relDelete);

});