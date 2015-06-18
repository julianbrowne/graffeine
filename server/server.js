
var graffeine = require('./lib/graffeine');
var gutil = require("./lib/gutil");

gutil.log('Starting Graffeine Server');

graffeine.command.socket.on('connection', function (socket) { 

    gutil.log('socket: connection');

    var run = graffeine.command;
    var event = graffeine.eventManager(socket);

    event.on("graph-init", run.graph.init);
    event.on("graph-delete", run.graph.remove);
    event.on("graph-stats", run.graph.stats);
    event.on("graph-fetch", run.graph.fetch);
    event.on("graph-load", run.graph.load);
    event.on("node-join", run.node.join);
    event.on("node-add", run.node.add);
    event.on("node-update", run.node.update);
    event.on("node-find", run.node.find);
    event.on("node-delete", run.node.remove);
    event.on("nodes-orphans", run.node.orphans);
    event.on("path-all", run.path.all);
    event.on("path-delete", run.path.remove);

});