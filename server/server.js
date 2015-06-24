
var graffeine = require("./lib/graffeine");
var gutil = require("./lib/gutil");

gutil.log("Starting Graffeine Server");

graffeine.on("client-connected", function (client) { 

    "use strict";

    gutil.log("server: new client connection");

    var event = graffeine.eventManager(client);

    event.on("graph:init", graffeine.receiver.commands.graph.init);
    event.on("graph:nodes", graffeine.receiver.commands.graph.nodes);
    event.on("graph:paths", graffeine.receiver.commands.graph.paths);
    event.on("graph:remove", graffeine.receiver.commands.graph.remove);
    event.on("graph:stats", graffeine.receiver.commands.graph.stats);
    event.on("graph:fetch", graffeine.receiver.commands.graph.fetch);
    event.on("graph:load", graffeine.receiver.commands.graph.load);

    event.on("nodes:add", graffeine.receiver.commands.nodes.add);
    event.on("nodes:update", graffeine.receiver.commands.nodes.update);
    event.on("nodes:find", graffeine.receiver.commands.nodes.find);
    event.on("nodes:remove", graffeine.receiver.commands.nodes.remove);
    event.on("nodes:orphans", graffeine.receiver.commands.nodes.orphans);

    event.on("paths:add", graffeine.receiver.commands.paths.add);
    event.on("paths:remove", graffeine.receiver.commands.paths.remove);

});
