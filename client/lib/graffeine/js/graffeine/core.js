
Graffeine = (function() { 

    var config = null; // applied by loader
    var socket = null;

    function init() { 
        console.log("graffeine: init");
        Graffeine.graph.init();
        connect();
    };

    function connect() { 
        console.log("graffeine: connecting to web socket");
        if(typeof io === "undefined")
            throw "No web socket";
        else { 
            console.log(io);
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
        init: init
    };

}());