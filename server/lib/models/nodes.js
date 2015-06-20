
var util = require("util");
var db = require('./neo4j');

module.exports = (function() { 

    function add(nodeData, callback) { 
        var cypher = util.format("CREATE (n %s %s) RETURN n", labels(nodeData), properties(nodeData));
        db.query(cypher, callback, ["n"]);
    };

    function remove(id, callback) { 
        var cypher = util.format("MATCH n WHERE ID(n) = %s OPTIONAL MATCH n-[r]-() DELETE r, n", id);
        db.query(cypher, callback);
    };

    function count(callback) { 
        var cypher = "MATCH n RETURN count(n)";
        db.query(cypher, callback, "count(n)");
    };

    function find(properties, callback) { 
        var cypher = util.format("MATCH (n %s) RETURN n", JSON.stringify(properties));
        db.query(cypher, callback, ["n"]);
    };

    function orphans(callback) { 
        var cypher = "OPTIONAL MATCH (n) WHERE NOT (n)--() RETURN distinct n";
        db.query(cypher, callback, ["n"]);
    };

    function labels(nodeData) { 
        var labels = (typeof nodeData.labels === "undefined") ? [] : nodeData.labels;
        var cypherLabels = (labels.length > 0) ? ":" + labels.join(":") : "";
        return cypherLabels;
    };

    function properties(nodeData) { 
        var properties = (typeof nodeData.data === "undefined") ? {} : nodeData.data;
        return JSON.stringify(properties);
    };

    return { 
        add: add,
        remove: remove,
        count: count,
        find: find,
        orphans: orphans
    };

}());
