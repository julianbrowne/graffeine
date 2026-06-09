
var fs = require("fs");
var util = require("util");
var path = require("path");

var config = require("../config/server.json");

module.exports = (function() { 

    "use strict";

    var appRoot = path.dirname(require.main.filename);

    function format(int, zeros) { 
        var template = "00000"; 
        return (template + int).slice(0 - zeros);
    }

    function timestamp() { 
        var now = new Date();
        return util.format("%s:%s:%s.%s", 
            format(now.getHours(), 2), 
            format(now.getMinutes(), 2), 
            format(now.getSeconds(), 2), 
            format(now.getMilliseconds(), 3)
        );
    }

    function gprint(type, message) { 
        console.log("%s: %s - %s", timestamp(), type, message);
    }

    function log() { 
        var message = util.format.apply(this, arguments);
        gprint("INF", message);
    }

    function error() { 
        var message = util.format.apply(this, arguments);
        gprint("ERR", message.red);
    }

    function debug() { 
        if(!config.debug) { 
            return;
        }
        var message = util.format.apply(this, arguments);
        gprint("DBG", message.yellow);
    }

    /**
     * Doug Crockford's useful type determinator
    **/

    function getType(value) { 
        var s = typeof value;
        if (s === "object") { 
            if (value) { 
                if (Object.prototype.toString.call(value) === "[object Array]") { 
                    s = "array";
                }
            } else { 
                s = "null";
            }
        }
        return s;
    }

    /**
     * Doug Crockford's useful string template hydrator (modified)
    **/

    function supplant(s, o) { 
        return s.replace(/{([^{}]*)}/g, function (a, b) { 
            var r = o[b];
            if(getType(r) === "string") { return r; }
            if(getType(r) === "number") { return r };
            if(getType(r) === "object") { return util.inspect(r) };
            if(getType(r) === "array") { return r.join(",") };
            if(getType(r) === "boolean") { return r.toString() };
            if(getType(r) === "function") { return "function" };
            return a;
        });
    }

    function die() { 
        var message = util.format.apply(this, arguments);
        error(message);
        process.exit(-1);
    }

    function registerEvent(manager, commands, channel, action) { 
        var eventTag = channel + ":" + action;
        log("registering %s", eventTag);
        manager.on(eventTag, commands[channel][action]);
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
        var dataDir = appRoot + "/" + config.gists;
        try { 
            fs.accessSync(dataDir, fs.F_OK);
        }
        catch (e) { 
            error("** gists directory %s not accessible", dataDir);
            return [];
        }
        var files = fs.readdirSync(dataDir);
        if(files.length===0) { 
            error("** no gists in: %s", dataDir);
            return [];
        }
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
        getType: getType,
        supplant: supplant,
        registerEvent: registerEvent,
        loadRelativeFile: loadRelativeFile
    };

}());