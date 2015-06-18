
var db = require('./neo4j');
var fs = require('fs');

var Graph = {

    /**
     *  Retreive all nodes and relationships up to a reasonable limit
     *  otherwise it's easy to kill the neo4j server
     *
     *  @param {callback} callback function to receive the result
    **/

    all: function(callback) { 

        var cypher = [
            "MATCH (n)",
            "OPTIONAL MATCH (n)-[r]->()",
            "RETURN distinct n, labels(n) AS labels, r"
//            "LIMIT 200"
        ].join("\n");

        util.runQuery(cypher, callback, [ "n", "labels", "r" ]);

    },

    delete: function(callback) { 
        var cypher = [ 
            "MATCH (n)",
            "OPTIONAL MATCH (n)-[r]-()",
            "DELETE n,r"
        ].join("\n");
        util.runQuery(cypher, callback);
    },

    load: function(name, callback) { 
        this.delete(function() { 
            // @todo: move to gutil.loadFile
            var cypherFilePath = "data/"+name+".cypher";
            fs.exists(cypherFilePath, function(exists) { 
                if(exists) { 
                    fs.readFile(cypherFilePath, "utf-8", function (err, cypher) { 
                        if (err) throw err;
                        util.runQuery(cypher, callback);
                    });
                }
                else { 
                    console.warn("** no such file: %s", cypherFilePath);
                }
            });
        });
    }

};

exports.graph = Graph;
