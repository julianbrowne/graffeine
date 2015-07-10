
Graffeine = (function() { 

    var config = null; // applied by loader
    var socket = null;

    var settings = { 
        gists: []
    };

    function init() { 
        Graffeine.graph.init();
        connect();
    };

    function set(key, value) { 
        settings[key] = value;
    };

    function connect() { 
        Graffeine.util.log("core.connect: connecting to web socket");
        if(typeof io === "undefined")
            throw "No web socket";
        else { 
            socket = io(Graffeine.config.core.host);
            socket.on("connect", function() { Graffeine.ui.state.connectDB(); });
            socket.on("disconnect", function(error) { Graffeine.ui.state.disconnectDB(); });
            // register all receivers
            Graffeine.command.init();
        }
    };

    return { 
        socket: function() { return socket; },
        init: init,
        set: set,
        settings: settings
    };

}());