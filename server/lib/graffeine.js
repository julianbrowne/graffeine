

var util = require("util");
var sio = require("socket.io");
var events = require("events");
var colors = require('colors');

var config = require("../config/server.json");
var gutil = require("./gutil");
var Sender = require("./sender/Sender");
var Receiver = require("./receiver/Receiver");
var http = require("./http");

module.exports = (function() { 

    "use strict";

    util.inherits(Graffeine, events.EventEmitter);

    return new Graffeine;

    function Graffeine() { 

        var graffeine=this;

        gutil.log("Starting WS server on " + config.http.port);
        this.socket = sio.listen(http.listener, { log: false });

        this.sender = new Sender(this.socket);

        this.receiver = new Receiver(this.socket);

        this.socket.on("connection", function(client) { 
            graffeine.emit("client-connected", client);
        });

        this.eventManager = function(connection) { 
            if(connection === undefined || connection ===  null) { 
                gutil.die("invalid client connection passed to event manager");
            }
            return new function() { 
                this.connection = connection;
                function run(event, func) { 
                    return function() { 
                        gutil.log(colors.blue("event: received: %s: %s"), event, util.format.apply(this, arguments));
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
