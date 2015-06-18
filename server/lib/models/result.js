
var GNode = require("./gnode");
var gutil = require("../gutil");

module.exports = (function() { 

    function mapIndexQueryResult(nodes) { 
        return nodes.map(function (node) { return node.data; });
    };

    function mapCypherQueryResult(results, columnsWanted) { 
        var items = [];
        columnsWanted = (columnsWanted === undefined) ? [] : columnsWanted;
        results.forEach(function(resultObj) {
            var resultColumns = Object.keys(resultObj);
            resultColumns.forEach(function(column) { 
                if(column==='labels') return;
                if(columnsWanted.indexOf(column.toString()) !== -1) { 
                    /** some path columns come back null **/
                    if(resultObj[column]!==null) { 
                        // Arrays are always paths
                        if(resultObj[column] instanceof Array) {
                            resultObj[column].forEach(function(path) {
                                var item = path;
                                item.node = 'r';
                                items.push(item);
                            });
                        }
                        else { 
                            var item = resultObj[column];
                            item.node = column;
                            item.labels = resultObj['labels'] ? resultObj['labels'] : [];
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
    };

    function processQueryResult(callback, processor, columns, timer) { 
        var self = this;
        return function(error, results) { 
            if (error) { 
                gutil.error(error);
            }
            else { 
                var nodes = processor(results, columns);
                timer.end = new Date().getTime();
                console.log((timer.end-timer.start) + ": \"" + timer.command.replace(/\r?\n|\r/g, " ") + "\"");
                // @todo: refactor out global
                if(global.graffeineClientSocket!==undefined) { 
                    global.graffeineClientSocket.emit('query-data', { 
                        data: timer,
                        updatedAt: new Date().getTime()
                    });
                };

                callback(nodes);
            }
        }
    };

    function booleanResult(callback) { 
        return function(error, result) { 
            if(error)
                gutil.error(error);
            else
                callback(true);
        }
    };

    function mapCypherAggregateResult(results, key) { 
        return results[0][key];
    };

    return { 
        mapIndexQueryResult: mapIndexQueryResult,
        mapCypherQueryResult: mapCypherQueryResult,
        processQueryResult: processQueryResult,
        booleanResult: booleanResult,
        mapCypherAggregateResult: mapCypherAggregateResult
    };

}());