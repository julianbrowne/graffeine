/**
 *  Graph-wide model
**/

var util  = require('./shared').utils;

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
            "RETURN distinct n, r",
            "LIMIT 200"
        ].join("\n");

        util.runQuery(cypher, callback, [ "n", "r" ]);

    }

}

exports.graph  = Graph;
