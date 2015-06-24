
var util = require("util");
var events = require("events");
var colors = require("colors");

var gutil = require("./gutil");
var config = require("../config/server.json");
var Sender = require("./sender/Sender");
var Receiver = require("./receiver/Receiver");
var socket = require("./listener/socket");

module.exports = (function() { 

    "use strict";

    util.inherits(Graffeine, events.EventEmitter);

    return new Graffeine;

    function Graffeine() { 

        var graffeine=this;

        gutil.log("Starting WS server on " + config.http.port);
        //this.socket = sio.listen(http.listener, { log: false });

        this.sender = new Sender(socket);

        this.receiver = new Receiver(socket);

        socket.on("connection", function(client) { 
            graffeine.emit("client-connected", client);
        });

        this.eventManager = function(connection) { 
            if(connection === undefined || connection ===  null) { 
                gutil.die("invalid client connection passed to event manager");
            }
            return new function() { 
                this.connection = connection;
                function run(event, func) { 
                    if(func === undefined) { 
                        gutil.die("attempt to register undefined callback for %s", event);
                    }
                    gutil.debug("event: registered callback %s for %s", func.name, event);
                    return function() { 
                        gutil.log("event: received: %s: %s".blue, event, util.format.apply(this, arguments));
                        func.apply(this, arguments);
                    };
                }
                this.on = function(event, func) { 
                    this.connection.on(event, run(event, func));
                };
            };
        }
    }

}());
