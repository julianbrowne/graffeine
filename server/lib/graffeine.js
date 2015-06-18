
var fs = require('fs');
var config = require("../config/server.json");
var command = require('./command');

module.exports = (function() { 

    var gists = [];

    init();

    function init() {
        getGists();
    };

    function getGists() { 
        fs.readdir(config.gists, function(err, files) { 
            files.forEach(function(f) { if(f[0]!==".") gists.push(f.replace(/\.cypher/,"")); });
        });
    };

    return { 
        command: command,
        gists: gists
    };

}());