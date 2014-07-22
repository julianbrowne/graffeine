/**
 *  Nodes Model
**/

var db    = require('./helper').conn;
var util  = require('./helper').utils;
var g     = require('../common.js');

var Nodes = { 

    /**
     *  Retrieve all nodes in the graph
     *
     *  @param {function} callback
    **/

    all: function(callback) { 

        var cypher = [
            "MATCH (n)",
            "RETURN n"
        ].join("\n");

        util.runQuery(cypher, callback, [ "n" ]);

    },

    labels: function(id, callback) { 

        var cypher = [
            "MATCH (n)",
            "WHERE id(n) = " + id,
            "RETURN labels(n)"
        ].join("\n");

        util.runQuery(cypher, callback, "labels(n)");

    },

    /**
     *  Get a count of nodes in the graph
     *
     *  @param {function} callback
    **/

    count: function(callback) { 

        var cypher = [ 
            "START n=node(*)",
            "RETURN count(n)"
        ].join("\n");

        util.runQuery(cypher, callback, "count(n)");

    },

    /**
     *  Get a connected nodes from a start node
     *
     *  @param {integer} start id of the node to start from
     *  @param {function} callback
    **/

    from: function(start, callback) {

        var cypher = [ 
//            "START n=node(" + start + ")",
            "OPTIONAL MATCH (n)-[r*1..2]-(m)",
            "RETURN n, r, m"
        ].join("\n");

        util.runQuery(cypher, callback, [ "n", "r", "m" ]);

    },

    /**
     *  Global search for node with specific name and type
     *
     *  @param {string} name name of node
     *  @param {string} type type of node
     *  @param {function} callback
    **/

    find: function(name, type, callback) { 

        if(name===''&&type==='') var match = "MATCH (n)";
        if(name!==''&&type==='') var match = "MATCH (n {name: '"+name+"'})";
        if(name===''&&type!=='') var match = "MATCH (n {type: '"+type+"'})";
        if(name!==''&&type!=='') var match = "MATCH (n {name: '"+name+"', type: '"+type+"'})";

        var cypher = [ match, "RETURN n" ].join("\n");

        util.runQuery(cypher, callback, [ "n" ]);

    },

    /**
     *  Get orphaned (no relationship) nodes
     *
     *  @param {function} callback
    **/

    orphans: function(callback) {

        var cypher = [ 
            "OPTIONAL MATCH (n)",
            "WHERE NOT (n)--()",
            "RETURN distinct n"
        ].join("\n");

        util.runQuery(cypher, callback, [ "n" ]);

    },

    /**
     *  Add a single node to the graph
     *
     *  @param {node} nodeData
     *  @param {function} callback
    **/

    add: function(nodeData, callback) { 
        g.log("new node data: '%s'", JSON.stringify(nodeData));
        var newNode = db.createNode(nodeData);
        newNode.save(util.errorHandler(callback));
    },

    /**
     *  Delete a single node from the graph
     *
     *  @param {integer} nodeId id value of the node to delete
     *  @param {function} callback
    **/

    delete: function(nodeId, callback) {

        var cypher = [
            "START n=node(" + nodeId + ")",
            "OPTIONAL MATCH n-[r]-()",
            "DELETE r, n"
        ].join("\n");

        util.runQuery(cypher, callback);

    },

    /**
     *  Update node with new data
     *
     *  @param {integer} nodeId id value of the node to update
     *  @param {object} data new node data to apply
     *  @param {function} callback
    **/

    update: function(nodeId, data, callback) {

        Nodes.get(nodeId, function(node) {
            if(node === null)
                g.die("nodes.update could not find node with id " + nodeId + " to update");
            else {
                for (var attr in data) {
                    node.data[attr] = data[attr];
                }
                node.save(util.errorHandler(callback));
            }
        });
    },

    /**
     *  Fetch a single node from the graph
     *
     *  @param {integer} id the identifier of the node
     *  @param {function} callback
    **/

    get: function(id, callback) {

        db.getNodeById(id, function(error, result) {

            if (error) {
                console.error('*** ERROR : get - fetching node > ' + error);
                callback(null);
            }
            else {
                callback(result);
            }
        });

    },

    join: function(source, target, rel, callback) {
        Nodes.get(source, function(source) {
            Nodes.get(target, function(target) {
                source.createRelationshipTo(target, rel, {}, util.booleanResult(callback));
            });
        });
    }

};

exports.nodes = Nodes
