
var graffeine = require('./lib/graffeine');
var gutil = require("./lib/gutil");

gutil.log('Starting Graffeine Server');

graffeine.command.socket.on('connection', function (socket) { 

    gutil.log('socket: connection');

    var run = graffeine.command;

    socket.on('graph-init', run.graph.init);
    socket.on("graph-delete", run.graph.remove);
    socket.on('graph-stats', run.graph.stats);
    socket.on('graph-fetch', run.graph.fetch);
    socket.on('graph-load', run.graph.load);
    socket.on('node-join', run.node.join);
    socket.on('node-add', run.node.add);
    socket.on('node-update', run.node.update);
    socket.on('node-find', run.node.find);
    socket.on('node-delete', run.node.remove);
    socket.on('nodes-orphans', run.node.orphans);
    socket.on('path-all', run.path.all);
    socket.on('path-delete', run.path.remove);

});