
var db = require('./neo4j');
var utils = require('./utils');

module.exports = (function() {

    function nodeLabels(nodeData) {
        var lbls = (typeof nodeData.labels === "undefined") ? [] : nodeData.labels;
        return lbls.length > 0 ? ":" + lbls.join(":") : "";
    }

    function add(nodeData, callback) {
        var labelStr = nodeLabels(nodeData);
        var props = utils.extractProperties(nodeData);
        var hasProps = Object.keys(props).length > 0;
        var cypher = "CREATE (n" + labelStr + ")" + (hasProps ? " SET n = $props" : "") + " RETURN n, labels(n) AS labels";
        var params = hasProps ? { props: props } : {};
        db.query({ query: cypher, params: params }, callback, ["n", "labels"]);
    }

    function remove(id, callback) {
        var cypher = "MATCH (n) WHERE id(n) = $id OPTIONAL MATCH (n)-[r]-() DELETE r, n";
        var params = { id: id };
        db.query({ query: cypher, params: params }, callback);
    }

    function update(id, properties, labels, callback) {
        properties = properties || {};
        labels = labels || [];

        var labelStr = labels.length > 0 ? " " + labels.map(function(l) { return ":" + l; }).join("") : "";
        var hasProps = Object.keys(properties).length > 0;
        var setParts = [];
        if (labelStr) setParts.push("n" + labelStr);
        if (hasProps) setParts.push("n = $props");
        var setClause = setParts.length > 0 ? " SET " + setParts.join(", ") : "";
        var cypher = "MATCH (n) WHERE id(n) = $id" + setClause + " RETURN n, labels(n) AS labels";
        var params = hasProps ? { id: id, props: properties } : { id: id };
        db.query({ query: cypher, params: params }, callback, ["n", "labels"]);
    }

    function count(callback) {
        var cypher = "MATCH (n) RETURN count(n)";
        db.query(cypher, callback, "count(n)");
    }

    function find(name, type, callback) {
        var conditions = [];
        var params = {};
        if (name) { conditions.push("n.name = $name"); params.name = name; }
        if (type) { conditions.push("n.type = $type"); params.type = type; }
        var where = conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";
        var cypher = "MATCH (n)" + where + " RETURN n, labels(n) AS labels";
        db.query({ query: cypher, params: params }, callback, ["n", "labels"]);
    }

    function orphans(callback) {
        var cypher = "MATCH (n) WHERE NOT (n)--() RETURN n, labels(n) AS labels";
        db.query(cypher, callback, ["n", "labels"]);
    }

    return {
        add: add,
        remove: remove,
        update: update,
        count: count,
        find: find,
        orphans: orphans
    };

}());
