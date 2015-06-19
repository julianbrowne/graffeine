
var util = require("util");
var command = require("./command");
var gutil = require("./gutil");

module.exports = (function() { 
    "use strict";
    return { 
        command: command,
        eventManager: function(socket) { 
            return new function() { 
                this.socket = socket;
                function run(tag, action) { 
                    return function() { 
                        gutil.log("event: received: %s: %s", tag, util.format.apply(this, arguments));
                        action.apply(this, arguments);
                    };
                }
                this.on = function(tag, action) { 
                    this.socket.on(tag, run(tag, action));
                };
            };
        }
    };

}());
