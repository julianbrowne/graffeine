
var bus = require("postal");

var GNode = require("./gnode");
var gutil = require("../gutil");

module.exports = (function() { 

    "use strict";

    function Responder() { };

    var responder = new Responder();

/**
    function mapIndexQueryResult(nodes) { 
        return nodes.map(function (node) { return node.data; });
    }
**/

    function mapCypherAggregateResult(results, key) { 
        //gutil.log("aggregate result: %s", JSON.stringify(results));
        return results[0][key];
    }

    function mapCypherQueryResult(results, columnsWanted) { 
        //gutil.log("mapCypherQueryResult: raw: %s", JSON.stringify(results));
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
        //gutil.log("mapCypherQueryResult: items: %s", JSON.stringify(items));
        return items.map(GNode);
    }

    function recordEndTime(clock) {
        clock.end = new Date().getTime();
        clock.time = clock.end - clock.start;
        return clock;
    }

    function processQueryResult(callback, processor, columns, clock) { 
        return function(error, results) { 
            bus.publish({ channel: "info", topic: "query", data: { message: "processing query" } });
            if (error) { 
                errorResult(error);
            }
            else { 
                var nodes = processor(results, columns);
                callback(nodes, recordEndTime(clock));
            }
        };
    }

    function booleanResult(callback, clock) { 
        return function(error, result) { 
            if(error) { 
                errorResult(error);
            }
            else { 
                callback(result, recordEndTime(clock));
            }
        };
    }

    function errorResult(error) { 
        gutil.error(error);
        if(error.hasOwnProperty("code")) { 
            if(error.code === "ECONNREFUSED") { 
                bus.publish({ 
                    channel: "server", 
                    topic: "info", 
                    data: { 
                        category: "warning", 
                        title: "Neo4J Error", 
                        message: "Can't connect to Neo4J. Is it running?" 
                    }
                });
            }
            else { 
                bus.publish({ 
                    channel: "server", 
                    topic: "info", 
                    data: { 
                        category: "warning", 
                        title: "Neo4J Error", 
                        message: "Error: " + error.code
                    }
                });
            }
        }
        else { 
            bus.publish({ 
                channel: "server", 
                topic: "info", 
                data: { 
                    category: "warning", 
                    title: "Neo4J Error", 
                    message: JSON.stringify(error) 
                }
            });
        }
    }

    return { 
        // mapIndexQueryResult: mapIndexQueryResult,
        mapCypherQueryResult: mapCypherQueryResult,
        processQueryResult: processQueryResult,
        booleanResult: booleanResult,
        mapCypherAggregateResult: mapCypherAggregateResult
    };

}());
