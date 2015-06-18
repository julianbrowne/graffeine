
var neo4j = require("neo4j");
var util = require("util");

var gutil = require("../gutil");
var config = require("../../config/server.json");

exports.db = (function() { 

    var connectionString = util.format("http://%s:%s", config.neo4j.host, config.neo4j.port);
    var connection = null;

    gutil.log("neo4j: connecting to %s", connectionString);

    try { 
        connection = new neo4j.GraphDatabase({ 
            url: connectionString,
            auth: {username: config.neo4j.username, password: config.neo4j.password}
        });
    }
    catch(error) { 
        gutil.die("neo4j: connection: %s", error);
    }

    return { 
        db: connection
    };

}());