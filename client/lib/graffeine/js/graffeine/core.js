
Graffeine = (function() { 

    var config = null; // applied by loader
    var socket = null;

    var settings = { 
        dbs: []
    };

    function init() { 
        console.log("graffeine: init");
        Graffeine.graph.init();
        connect();
    };

    function set(key, value) { 
        settings[key] = value;
    };

    function connect() { 
        console.log("graffeine: connecting to web socket");
        if(typeof io === "undefined")
            throw "No web socket";
        else { 
            socket = io(Graffeine.config.core.host);
            socket.on("connect", function() { Graffeine.ui.state.connectDB(); });
            socket.on("disconnect", function(error) { Graffeine.ui.state.disconnectDB(); });
            // register all receivers
            Graffeine.command.init();
            Graffeine.command.gatherDBStats();
        }
    };

    return { 
        socket: function() { return socket; },
        init: init,
        set: set,
        settings: settings
    };

}());