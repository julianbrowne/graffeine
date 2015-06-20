
var util = require("util");
var db = require('./neo4j');

module.exports = (function() { 

    function add(sourceId, targetId, name, callback) { 
        var cypher = util.format("MATCH (a),(b) WHERE a.id = %s AND b.id = %s CREATE (a)-[r:%s]->(b) RETURN r",sourceId, targetId, name);
        db.query(cypher, callback, ["r"]);
    }

    function remove(sourceId, targetId, name, callback) { 
        var cypher = util.format("MATCH (a)-[r:%s]-(b) WHERE ID(a) = %s AND ID(b) = %s DELETE r", name, sourceId, targetId);
        db.query(cypher, callback);
    }

    function count(callback) { 
        var cypher = "START r=rel(*) RETURN count(r)";
        db.query(cypher, callback, "count(r)");
    }

    return { 
        add: add,
        remove: remove,
        count: count
    };

}());