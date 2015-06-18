
var util = require('util');
var config = require('../config/server.json');

module.exports = (function() { 

    function log() { 
        var message = util.format.apply(this, arguments);
        util.log('INF : ' + message);
    };

    function error() { 
        var message = util.format.apply(this, arguments);
        util.log('ERR : ' + message);
    };

    function debug() { 
        if(!config.debug) return;
        var message = util.format.apply(this, arguments);
        if(server.debug) util.log('DBG : ' + message);
    };

    function timestamp() { 
        var now = new Date();
        return ( 
            (now.getMonth() + 1) + '/' +
            (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':' +
            ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' +
            ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds()))
        );
    };

    function die() { 
        var message = util.format.apply(this, arguments);
        error(message);
        process.exit(-1);
    };

    return { 
        log: log,
        error: error,
        debug: debug,
        timestamp: timestamp,
        die: die
    };

}());