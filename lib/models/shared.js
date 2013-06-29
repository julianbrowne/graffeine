/**
 *  Shared common model utility functions for processing results, handling
 *  exceptions, formatting returned output etc.
**/

var util = require('util');
var g = require('../common');

var shared = {

    /**
     *  Maps a list of neo4j node objects, from an index query, to a set containing
     *  only the obj.data information
     *
     *  @param {array} nodes list of neo4j nodes for processing
     *  @returns {array} list of nodes reduced to node.data info
    **/

    mapIndexQueryResult: function(nodes) {
        return nodes.map(function (node) { return node.data; });
    },

    /**
     *  Unifies node and relationship cypher results into a single graffNode object.
     *  Nodes are denoted either by the column name (n or m) or by passing type
     *  to the function.
     *
     *  @param {neo4JNodeObj} neoNode neo4j node or relationship query result
     *  @todo major refactor required
    **/

    graffNode: function(neoNode) {

        var neoType = neoNode.node;
        var graffNode = {};

        graffNode.data   = neoNode.data || {};
        graffNode.id     = neoNode.id;
        graffNode.self   = neoNode.self;
        graffNode.exists = neoNode.exists;

        if(neoType === 'r') {
            graffNode.node   = 'r';
            graffNode.type   = neoNode.type || '-';
            graffNode.start  = neoNode.start.id;
            graffNode.end    = neoNode.end.id;
            return graffNode;
        }

        if(neoType === 'n' || neoType === 'm') {

            graffNode.node  = 'n';

            // Set (initial) node type

            for(var i=0; i < g.config.graph.typeFields.length; i++) {
                var field = g.config.graph.typeFields[i];
                if(neoNode.data[field] !== undefined) {
                    graffNode.type = neoNode.data[field];
                    break;
                }
            };
            if(graffNode.type === undefined) graffNode.type = 'default';

            // set style

            graffNode.style = {};

            // first, set default style, then override one by one ..

            if(!g.config.graph.useCssStyle) {
                Object.keys(g.config.nodes.default.style).forEach(function(key) {
                    graffNode.style[key] = g.config.nodes.default.style[key];
                });

                if(g.config.nodes[graffNode.type] !== undefined && g.config.nodes[graffNode.type].style !== undefined) {
                    Object.keys(g.config.nodes[graffNode.type].style).forEach(function(key){
                        graffNode.style[key] = g.config.nodes[graffNode.type].style[key];
                    });
                }
            }

            // todo - change to use yaml config ..

            graffNode.label = { fill: '#000000' };

            // Set node name and override type if name field denotes type
            // as per Dr. Who example

            for(var i=0; i < g.config.graph.nameFields.length; i++) {
                var field = g.config.graph.nameFields[i];
                if(neoNode.data[field] !== undefined) {
                    graffNode.name = neoNode.data[field];
                    break;
                }
            };

            if(g.config.graph.useNameAsType) {
                graffNode.type = field;
            }

            if(graffNode.name === undefined) graffNode.name = '-';

            // Set extras

            [ 'icon' ].forEach(function(c) {
                if(g.config.nodes[graffNode.type]) {
                    if(g.config.nodes[graffNode.type][c] !== undefined)
                        graffNode[c] = g.config.nodes[graffNode.type][c];
                    else
                        graffNode[c] = g.config.nodes['default'][c];
                }
                else {
                    graffNode[c] = g.config.nodes['default'][c];
                }
            });

            return graffNode;
        }

        console.log("WARNING: (graffNode) : unknown node type " + neoType);
    },

    mapCypherQueryResult: function(results, columnsWanted) {

        var items = [];
        columnsWanted = (columnsWanted === undefined) ? [] : columnsWanted;

        results.forEach(function(resultObj) {

            var resultColumns = Object.keys(resultObj);

            resultColumns.forEach(function(column) {

                if(columnsWanted.indexOf(column.toString()) !== -1) {

                    /** some rel columns come back null **/

                    if(resultObj[column]!==null) {

                        // Arrays are always rels

                        if(resultObj[column] instanceof Array) {
                            resultObj[column].forEach(function(rel) {
                                var item = rel;
                                item.node = 'r';
                                items.push(item);
                            });
                        }
                        else {
                            var item = resultObj[column];
                            item.node = column;
                            items.push(item);
                        }
                    }
                }
                else {
                    // console.log("Column " + column + " not in " + util.inspect(columnsWanted));
                }

            });

        });

        return items.map(shared.graffNode);

    },

    processQueryResult: function(callback, processor, columns) {

        return function(error, results) {
            if (error) {
                g.die(error);
            }
            else {
                var nodes = processor(results, columns);
                callback(nodes);
            }
        }
    },

    /**
     *  Cypher query runner
     *
     *  @param {string} cypher the cypher query
     *  @param {callback} callback function to receive the result
     *  @param {array|string} columns the columns to return from the results query
    **/

    runQuery: function(cypher, callback, columns) {

        g.log("(runQuery) : begin\n" + cypher);
        g.log("(runQuery) : end");

        if(columns === undefined) {
            g.db.conn.query(cypher, {}, shared.booleanResult(callback));
        }
        else {
            if(typeof(columns)==="string")
                var proc = shared.mapCypherAggregateResult;
            else
                var proc = shared.mapCypherQueryResult;
            g.db.conn.query(cypher, {}, shared.processQueryResult(callback, proc, columns));
        }

    },

    booleanResult: function(callback) {
        return function(error, result) {
            if(error) {
                console.log("ERROR: " + util.inspect(error));
                callback(false);
            }
            else
                callback(true);
        }
    },

    /**
     *  Parses the result of an aggregate (count, sum, avg) cypher query
    **/

    mapCypherAggregateResult: function(results, key) {
        return results[0][key];
    },

    /**
     *  Generic error handler for single node adds and gets. Passes the neo4j node
     *  through GraffNode on the way back to standardise it for d3 consumption
     *
     *  @param {function} callback
    **/

    errorHandler: function(callback) {

        return function(error, result) {

            if (error) {
                console.error('ERROR: (errorHandler) : ' + util.inspect(error));
                callback(null);
            }
            else {
                result.node = 'n';
                var graffNode = shared.graffNode(result);
                callback(graffNode);
            }
        }
    }

};

exports.conn  = g.db.conn;
exports.utils = shared;
