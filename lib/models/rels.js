/**
 *  Relationships Model
**/

var util  = require('./shared').utils;

var Rels = {

    /**
     *  Get all rels in the graph
     *
     *  @param {function} callback
    **/

    all: function(callback) {

        var cypher = [
            "START n=node(*)",
            "MATCH n-[r]-m",
            "RETURN r"
        ].join("\n");

        util.runQuery(cypher, callback, [ "r" ]);

    },

    /**
     *  Get a count of relationships in the graph
     *
     *  @param {function} callback
    **/

    count: function(callback) {

        var cypher = [
            "START r=rel(*)",
            "RETURN count(r)"
        ].join("\n");

        util.runQuery(cypher, callback, "count(r)");
    },

    delete: function(source, target, rel, callback) {

        var cypher = [
            "START a = node(" + source + "), b = node(" + target + ")", // injection fix required
            "MATCH a-[r:`" + rel + "`]-b",
            "DELETE r"
        ].join("\n");

        util.runQuery(cypher, callback);

    }

}

exports.rels = Rels
