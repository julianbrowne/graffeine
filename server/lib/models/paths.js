
var util = require("util");
var db = require('./neo4j');

module.exports = (function() { 

    return { 

        all: function(callback) { 
            var cypher = "MATCH (n)-[r]-(m) RETURN r";
            db.query(cypher, callback, [ "r" ]);
        },

        count: function(callback) { 
            var cypher = "START r=rel(*) RETURN count(r)";
            db.query(cypher, callback, "count(r)");
        },

        remove: function(sourceId, targetId, name, callback) { 
            var cypher = util.format("MATCH (a)-[r:%s]-(b) WHERE ID(a) = %s AND ID(b) = %s DELETE r", name, sourceId, targetId);
            db.query(cypher, callback);
        }

    };

}());