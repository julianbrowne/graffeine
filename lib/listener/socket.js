
var sio = require("socket.io");

var http = require("./http");
var config = require("../../config.json").server;
var gutil = require("../gutil");

module.exports = (function() {

    var socket = sio(http.listener, {
        cors: {
            origin: function(origin, callback) {
                // Allow same-origin and localhost (including Vite dev server)
                if (!origin) return callback(null, true);
                var ok = origin.includes("localhost") || origin.includes("127.0.0.1");
                callback(ok ? null : new Error("CORS not allowed"), ok);
            },
            methods: ["GET", "POST"]
        }
    });

    socket.on("error", function(err) {
        gutil.error("socket: error: %s", err.message);
    });

    var emit = socket.emit;

    socket.emit = function() {
        gutil.debug("emit:", Array.prototype.slice.call(arguments)[0]);
        emit.apply(socket, arguments);
    };

    return socket;

})();
