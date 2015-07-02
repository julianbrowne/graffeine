
var util = require("util");
var fs = require("fs");

var db = require("./neo4j");
var gutil = require("../gutil");

module.exports = (function() { 

    function all(callback) { 
        var cypher = "MATCH (n) OPTIONAL MATCH (n)-[r]->() RETURN distinct n, labels(n) AS labels, r";
        db.query(cypher, callback, [ "n", "labels", "r" ]);
    };

    function remove(callback) { 
        var cypher = "MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r";
        db.query(cypher, callback);
    };

    function load(name, callback) { 
        remove(function() { 
            var fileName = util.format("data/%s.cypher", name);
            var cypher = gutil.loadRelativeFile(fileName);
            db.query(cypher, callback);
        });
    };

    function nodes(callback) { 
        var cypher = "MATCH (n) RETURN n, labels(n)";
        db.query(cypher, callback, [ "n", "labels(n)" ]);
    }

    function paths(callback) { 
        var cypher = "MATCH (n)-[r]-(m) RETURN r";
        db.query(cypher, callback, [ "r" ]);
    }

    return { 
        nodes: nodes,
        paths: paths,
        all: all,
        remove: remove,
        load: load
    };

}());