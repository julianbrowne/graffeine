
var sio = require("socket.io");

var http = require("./http");
var gutil = require("../gutil");

module.exports = (function() { 

    var socket = sio.listen(http.listener, { log: false });

    /**
     *  override socket.emit for debugging
    **/

    var emit = socket.emit;

    socket.emit = function() { 
        gutil.debug("emit:", Array.prototype.slice.call(arguments)[0]);
        emit.apply(socket, arguments);
    };

    return socket;

})();
