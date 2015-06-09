
Graffeine = (function() { 

    var config = null; // applied by loader
    var socket = null;

    function init() { 
        console.log("graffeine: init");
        connect();
    };

    function connect() { 
        console.log("graffeine: connecting to web socket");
        if(typeof io === "undefined")
            throw "No web socket";
        else { 
            socket = new io.connect(Graffeine.config.core.host);
            Graffeine.command.init();
        }
    };

    return { 
        socket: function() { return socket; },
        init: init
    };

}());