
var util = require("util");
var bus = require("postal");

var GNode = require("./gnode");
var gutil = require("../gutil");

module.exports = (function() { 

    "use strict";

    function Responder() { };
    //util.inherits(Responder, events.EventEmitter);

    var responder = new Responder();

    function mapIndexQueryResult(nodes) { 
        return nodes.map(function (node) { return node.data; });
    }

    function mapCypherAggregateResult(results, key) { 
        return results[0][key];
    }

    function mapCypherQueryResult(results, columnsWanted) { 
        var items = [];
        columnsWanted = (columnsWanted === undefined) ? [] : columnsWanted;
        results.forEach(function(resultObj) {
            var resultColumns = Object.keys(resultObj);
            resultColumns.forEach(function(column) { 
                if(column === "labels") { return; }
                if(columnsWanted.indexOf(column.toString()) !== -1) { 
                    /** some path columns come back null **/
                    if(resultObj[column] !== null) { 
                        // Arrays are always paths
                        if(resultObj[column] instanceof Array) {
                            resultObj[column].forEach(function(path) {
                                var item = path;
                                item.node = "r";
                                items.push(item);
                            });
                        }
                        else { 
                            var item = resultObj[column];
                            item.node = column;
                            item.labels = resultObj.labels ? resultObj.labels : [];
                            items.push(item);
                        }
                    }
                }
                else {
                    // console.log("Column " + column + " not in " + columnsWanted);
                }

            });
        });
        return items.map(GNode);
    }

    function processQueryResult(callback, processor, columns, clock) { 
        return function(error, results) { 
            bus.publish({ channel: "info", topic: "query", data: { message: "processing query" } });
            if (error) { 
                errorResult(error);
            }
            else { 
                var nodes = processor(results, columns);
                clock.end = new Date().getTime();
                clock.time = clock.end - clock.start;
                callback(nodes, clock);
            }
        };
    }

    function booleanResult(callback, clock) { 
        return function(error, result) { 
            if(error) { 
                errorResult(error);
            }
            else { 
                clock.end = new Date().getTime();
                callback(result, clock);
            }
        };
    }

    function errorResult(error) { 
        gutil.error(error);
        if(error.hasOwnProperty("code")) { 
            if(error.code === "ECONNREFUSED") { 
                var message = "Can't connect to Neo4J. Is it running?";
            }
        }
        else { 

        }
    }

    return { 
        mapIndexQueryResult: mapIndexQueryResult,
        mapCypherQueryResult: mapCypherQueryResult,
        processQueryResult: processQueryResult,
        booleanResult: booleanResult,
        mapCypherAggregateResult: mapCypherAggregateResult
    };

}());
