
var config = require("../config/server.json");
var command = require('./command');

module.exports = (function() { 

    return { 
        command: command,
    };

}());