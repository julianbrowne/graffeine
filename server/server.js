
var graffeine = require("./lib/graffeine");
var gutil = require("./lib/gutil");
var config = require("./config/server.json");

gutil.log("Starting Graffeine Server");

graffeine.on("client-connected", function (client) { 

    "use strict";

    gutil.log("server: new client connection");

    var manager = graffeine.eventManager(client);
    var command = graffeine.receiver.commands;

    /**
     *  Register all channel:event receivers
    **/

    for(var channel in config.channels) { 
        config.channels[channel].forEach(function(action) { 
            gutil.registerEvent(manager, command, channel, action);
        });
    };

});
