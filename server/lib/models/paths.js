
var db = require('./neo4j');

module.exports = (function() { 

    function add(sourceId, targetId, name, callback) { 
        var cypher = "MATCH (a),(b) WHERE ID(a) = {sourceId} AND ID(b) = {targetId} CREATE (a)-[r:{name}]->(b) RETURN r"
        var params = {sourceId: sourceId, targetId: targetId, name: name};
        db.query({query: cypher, params: params}, callback, ["r"]);
    }

    function remove(sourceId, targetId, name, callback) { 
        var cypher = "MATCH (a)-[r:{name}]-(b) WHERE ID(a) = {sourceId} AND ID(b) = {targetId} DELETE r"
        var params = {name: name, sourceId: sourceId, targetId: targetId};
        db.query({query: cypher, params: params}, callback);
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