
var fs = require('fs');
var util = require('util');

var config = require('../config/server.json');


module.exports = (function() { 

    function gprint(type, message) { 
        console.log('%s: %s - %s', timestamp(), type, message);
    };

    function log() { 
        var message = util.format.apply(this, arguments);
        gprint("INF", message);
    };

    function error() { 
        var message = util.format.apply(this, arguments);
        gprint("ERR", message);
    };

    function debug() { 
        if(!config.debug) { 
            console.warn("debug mode not set");
            return;
        }
        var message = util.format.apply(this, arguments);
        gprint("DBG", message);
    };

    function timestamp() { 
        var now = new Date();
        return util.format("%s:%s:%s.%s", 
            format(now.getHours(),2), 
            format(now.getMinutes(),2), 
            format(now.getSeconds(),2), 
            format(now.getMilliseconds(),3)
        );
    };

    function format(int, zeros) { 
        var template = "00000"; 
        return (template+int).slice(0-zeros);
    };

    function die() { 
        var message = util.format.apply(this, arguments);
        error(message);
        process.exit(-1);
    };

    function getGists() { 
        var gists = []
        fs.readdir(config.gists, function(err, files) { 
            files.forEach(function(f) { if(f[0]!==".") gists.push(f.replace(/\.cypher/,"")); });
        });
        return gists;
    };

    return { 
        gprint: gprint,
        format: format,
        log: log,
        error: error,
        debug: debug,
        timestamp: timestamp,
        die: die,
        getGists: getGists
    };

}());