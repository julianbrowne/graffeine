
var db = require('./neo4j');

module.exports = (function() { 

    function add(nodeData, callback) { 
        var cypher = "CREATE (n {labels} {props}) RETURN n";
        var params = { labels: labels(nodeData), props: properties(nodeData)};
        db.query({query: cypher, params: params}, callback, ["n"]);
    };

    function remove(id, callback) { 
        var cypher = "MATCH n WHERE ID(n) = {id} OPTIONAL MATCH n-[r]-() DELETE r, n";
        var params = { id: id };
        db.query({query: cypher, params: params}, callback);
    };

    function update(id, properties, labels, callback) { 

        var properties = properties || {};
        var labels = labels || [];

        if(labels.length > 0) { 
            var labelsCypher = "";
            labels.forEach(function(l) { labelsCypher += ":" + l; });
            var cypher = "MATCH n WHERE ID(n) = {id} SET n " + labelsCypher + " SET n = {props} RETURN n";
        }
        else {
            var cypher = "MATCH n WHERE ID(n) = {id} SET n = {props} RETURN n";
        }
        var params = { id: id, props: properties };

        db.query({query: cypher, params: params}, callback, ["n"]);

    };

    function count(callback) { 
        var cypher = "MATCH n RETURN count(n)";
        db.query(cypher, callback, "count(n)");
    };

    function find(properties, callback) { 
        var cypher = "MATCH (n {props}) RETURN n";
        var params = { props: properties };
        db.query({query: cypher, params: params}, callback, ["n"]);
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
        update: update,
        count: count,
        find: find,
        orphans: orphans
    };

}());
