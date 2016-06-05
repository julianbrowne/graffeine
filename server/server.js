
var graffeine = require("./lib/graffeine");
var gutil = require("./lib/gutil");

gutil.log("Starting Graffeine Server");

graffeine.on("client-connected", function (client) { 

    "use strict";

    gutil.log("server: new client connection");

    var event = graffeine.eventManager(client);

    // @todo - refactor this into just the list of events
    // and automatically map the command using the event name

    var cmd = graffeine.receiver.commands;

    event.on("graph:ping", cmd.graph.ping);
    event.on("graph:init", cmd.graph.init);
    event.on("graph:nodes", cmd.graph.nodes);
    event.on("graph:paths", cmd.graph.paths);
    event.on("graph:remove", cmd.graph.remove);
    event.on("graph:stats", cmd.graph.stats);
    event.on("graph:fetch", cmd.graph.fetch);
    event.on("graph:load", cmd.graph.load);
    event.on("graph:gists", cmd.graph.gists);

    event.on("nodes:add", cmd.nodes.add);
    event.on("nodes:update", cmd.nodes.update);
    event.on("nodes:find", cmd.nodes.find);
    event.on("nodes:remove", cmd.nodes.remove);
    event.on("nodes:orphans", cmd.nodes.orphans);

    event.on("paths:add", cmd.paths.add);
    event.on("paths:remove", cmd.paths.remove);

});
