/**
 *  Nodes Model
**/

var util = require("util");
var db = require('./helper').utils;

exports.nodes = (function(){ 

    function all(callback) { 
        var cypher = "MATCH (n) RETURN n, labels(n)";
        db.runQuery(cypher, callback, [ "n", "labels(n)" ]);
    };

    function count(callback) { 
        var cypher = "START n=node(*) RETURN count(n)";
        db.runQuery(cypher, callback, "count(n)");
    };

    function from(start, callback) { 
        var cypher = "OPTIONAL MATCH (n)-[r*1..2]-(m) RETURN n, r, m";
        db.runQuery(cypher, callback, ["n", "r", "m"]);
    };

    function find(properties, callback) { 
        var cypher = util.format("MATCH (n %s) RETURN n", JSON.stringify(properties));
        db.runQuery(cypher, callback, ["n"]);
    };

    function orphans(callback) { 
        var cypher = "OPTIONAL MATCH (n) WHERE NOT (n)--() RETURN distinct n";
        db.runQuery(cypher, callback, ["n"]);
    };

    function add(nodeData, callback) { 
        var cypher = util.format("CREATE (n %s %s) RETURN n", labels(nodeData), properties(nodeData));
        db.runQuery(cypher, callback, ["n"]);
    };

    function remove(id, callback) { 
        var cypher = util.format("START n=node(%s) OPTIONAL MATCH n-[r]-() DELETE r, n", JSON.stringify({id: id}));
        db.runQuery(cypher, callback);
    };

    function update(id, data, callback) { 
        // @todo : rewrite for cypher
    };

    function get(id, callback) { 
        // @todo : rewrite for cypher
    };

    function join(sourceId, targetId, name, callback) { 
        var cypher = util.format("MATCH (a),(b) WHERE a.id = %s AND b.id = %s CREATE (a)-[r:%s]->(b) RETURN r",sourceId, targetId, name);
        db.runQuery(cypher, callback, ["r"]);
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
        all: all,
        get: get,
        add: add,
        join: join,
        remove: remove,
        update: update,
        count: count,
        find: find,
        orphans: orphans
    };

}());
