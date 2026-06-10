
var gutil = require("../gutil");
var commands = require("./commands");

module.exports = (function() { 

    "use strict";

    function Receiver(socket) { 
        this.socket = socket;
        this.receive = this.socket.on;
        this.commands = commands;
    }    

    return Receiver;

}());
