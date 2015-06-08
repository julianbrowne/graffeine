
var Graffeine = (function() { 

    var socket = null;

    function connect() { 
        console.log("graffeine: connecting");
        if(typeof io === "undefined")
            throw "No web socket";
        else
            socket = new io.connect(Graffeine.config.core.host);
    };

    return { 

        socket: function() {
            return socket;
        },

        init: function() { 
            console.log("graffeine: init");
            connect();
        }
    }

}());