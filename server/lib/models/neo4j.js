
var neo4j = require("neo4j");
var util = require("util");
var colors = require('colors');

var result = require("./result");
var gutil = require("../gutil");
var config = require("../../config/server.json");

module.exports = (function() { 

    var connectionString = util.format("http://%s:%s", config.neo4j.host, config.neo4j.port);
    var db = null;

    gutil.log("neo4j: connecting to %s", connectionString);

    try { 
        db = new neo4j.GraphDatabase({ 
            url: connectionString,
            auth: {username: config.neo4j.username, password: config.neo4j.password}
        });
    }
    catch(error) { 
        gutil.die("neo4j: connection: %s", error);
    }

    function query(cypher, callback, columns) { 

        if(cypher.query) { 
            var expandedCypher = gutil.supplant(cypher.query, cypher.params);
        }
        else { 
            var expandedCypher = cypher;
        }

        gutil.log("db.query: cypher - \"%s\"".gray, expandedCypher);

        var timer = { command: expandedCypher, start: new Date().getTime() };

        gutil.log("db.query: executing - %s", util.inspect(expandedCypher));

        if(columns === undefined) { 
            db.cypher(expandedCypher, result.booleanResult(callback, timer));
        }
        else { 
            if(typeof(columns)=="string") { 
                var proc = result.mapCypherAggregateResult;
            }
            else { // columns is array therefore it's a regular query
                var proc = result.mapCypherQueryResult;
            }
            db.cypher(expandedCypher, result.processQueryResult(callback, proc, columns, timer));
        }

    };

    return { 
        db: db,
        query: query
    };

}());