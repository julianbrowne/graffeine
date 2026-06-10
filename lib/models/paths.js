
var db = require('./neo4j');

module.exports = (function() {

    function safeType(name) {
        return String(name).replace(/[^a-zA-Z0-9_]/g, "");
    }

    function add(sourceId, targetId, pathName, callback) {
        var relType = safeType(pathName);
        var cypher = "MATCH (a),(b) WHERE id(a) = $source AND id(b) = $target CREATE (a)-[r:" + relType + "]->(b) RETURN r";
        var params = { source: sourceId, target: targetId };
        db.query({ query: cypher, params: params }, callback, ["r"]);
    }

    function remove(sourceId, targetId, name, callback) {
        var relType = safeType(name);
        var cypher = "MATCH (a)-[r:" + relType + "]-(b) WHERE id(a) = $sourceId AND id(b) = $targetId DELETE r";
        var params = { sourceId: sourceId, targetId: targetId };
        db.query({ query: cypher, params: params }, callback);
    }

    function count(callback) {
        var cypher = "MATCH ()-[r]-() RETURN count(r)";
        db.query(cypher, callback, "count(r)");
    }

    return {
        add: add,
        remove: remove,
        count: count
    };

}());
