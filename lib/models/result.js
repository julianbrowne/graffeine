
var neo4j = require("neo4j-driver");
var bus = require("postal");

var GNode = require("./gnode");
var gutil = require("../gutil");

module.exports = (function() {

    "use strict";

    function recordEndTime(clock) {
        clock.end = new Date().getTime();
        clock.time = clock.end - clock.start;
        return clock;
    }

    function toInt(value) {
        if (value === null || value === undefined) return null;
        if (neo4j.isInt(value)) return value.toNumber();
        return value;
    }

    function mapNode(val, columnName, record) {
        var labels = val.labels;
        try {
            var fromQuery = record.get("labels");
            if (Array.isArray(fromQuery)) labels = fromQuery;
        } catch (e) {}

        return {
            node: columnName,
            _id: toInt(val.identity),
            properties: val.properties,
            labels: labels,
            self: null,
            exists: true
        };
    }

    function mapRelationship(val) {
        return {
            node: "r",
            _id: toInt(val.identity),
            type: val.type,
            _fromId: toInt(val.start),
            _toId: toInt(val.end),
            properties: val.properties,
            labels: []
        };
    }

    function mapValue(record, column) {
        var val;
        try {
            val = record.get(column);
        } catch (e) {
            return null;
        }
        if (val === null || val === undefined) return null;

        if (val instanceof neo4j.types.Relationship) {
            return [mapRelationship(val)];
        }
        if (val instanceof neo4j.types.Node) {
            return [mapNode(val, column, record)];
        }
        if (Array.isArray(val)) {
            return val
                .filter(function(v) { return v instanceof neo4j.types.Relationship; })
                .map(mapRelationship);
        }
        return null;
    }

    function process(neoResult, callback, columns, clock) {
        if (columns === undefined) {
            callback(null, recordEndTime(clock));
            return;
        }

        if (typeof columns === "string") {
            var records = neoResult.records;
            var value = records.length > 0 ? records[0].get(columns) : 0;
            callback(toInt(value), recordEndTime(clock));
            return;
        }

        var items = [];
        neoResult.records.forEach(function(record) {
            columns.forEach(function(col) {
                if (col === "labels") return;
                var mapped = mapValue(record, col);
                if (mapped) items = items.concat(mapped);
            });
        });

        callback(items.map(GNode), recordEndTime(clock));
    }

    function handleError(error) {
        gutil.error(error.message || JSON.stringify(error));
        var message;
        var code = error.code || "";
        if (code === "ServiceUnavailable" || (error.message && error.message.indexOf("ECONNREFUSED") !== -1)) {
            message = "Can't connect to Neo4J. Is it running?";
        } else {
            message = error.message || JSON.stringify(error);
        }
        bus.publish({
            channel: "server",
            topic: "info",
            data: { category: "warning", title: "Neo4J Error", message: message }
        });
    }

    return {
        process: process,
        handleError: handleError
    };

}());
