
var fs = require('fs');
var util = require('util');
var colors = require('colors');
var path = require('path');

var config = require('../config/server.json');

module.exports = (function() { 

    var appRoot = path.dirname(require.main.filename);

    function gprint(type, message) { 
        console.log('%s: %s - %s', timestamp(), type, message);
    }

    function log(message) { 
        var message = util.format.apply(this, arguments);
        gprint("INF", message);
    }

    function error(message) { 
        var message = util.format.apply(this, arguments);
        gprint("ERR", message.red);
    }

    function debug(message) { 
        if(!config.debug) { 
            return;
        }
        var message = util.format.apply(this, arguments);
        gprint("DBG", message.yellow);
    }

    /**
     * Doug Crockford's useful string template hydrator
    **/

    function supplant(s, o) { 
        return s.replace(/{([^{}]*)}/g, function (a, b) { 
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        });
    }

    function timestamp() { 
        var now = new Date();
        return util.format("%s:%s:%s.%s", 
            format(now.getHours(),2), 
            format(now.getMinutes(),2), 
            format(now.getSeconds(),2), 
            format(now.getMilliseconds(),3)
        );
    }

    function format(int, zeros) { 
        var template = "00000"; 
        return (template+int).slice(0-zeros);
    }

    function die() { 
        var message = util.format.apply(this, arguments);
        error(message);
        process.exit(-1);
    }

    function loadRelativeFile(pathname) { 
        var fullPathName = appRoot+"/"+pathname;
        log("loading: %s", fullPathName);
        if(fs.existsSync(fullPathName)) { 
            var contents = fs.readFileSync(fullPathName, "utf-8");
            return contents;
        }
        else { 
            error("** no such file: %s", fullPathName);
            return "";
        }
    }

    function getGists() { 
        var gists = [];
        var dataDir = appRoot+"/"+config.gists;
        var files = fs.readdirSync(dataDir);
        for(var i=0; i<files.length; i++) { 
            if(files[i][0]!==".") { gists.push(files[i].replace(/\.cypher/,"")); }
        }
        return gists;                
    }

    return { 
        gprint: gprint,
        format: format,
        log: log,
        error: error,
        debug: debug,
        timestamp: timestamp,
        die: die,
        getGists: getGists,
        supplant: supplant,
        loadRelativeFile: loadRelativeFile
    };

}());