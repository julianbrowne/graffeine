
var bus = require("postal");

var config = require("../../config/server.json");
var gutil = require("../gutil");

module.exports = (function() { 

    "use strict";
    
    function Sender(socket) { 

        var sender = this;

        this.socket = socket;

        var channelData = config.channels;

        function sendy(message, envelope) { 
            sender.send(envelope.channel + ":" + envelope.topic, message);
        }

        Object.getOwnPropertyNames(channelData).forEach(function(channel) { 
            channelData[channel].forEach(function(topic) { 
                bus.subscribe({ channel: channel, topic: topic, callback: sendy });
            });
        });

        this.send = function(event, payload) { 
            gutil.log("> sending: %s", event);
            gutil.log("> payload: %s", JSON.stringify(payload));
            payload.timestamp = gutil.timestamp();
            socket.emit(event, payload);
        };

    }

    return Sender;

}());
