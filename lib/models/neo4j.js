
var neo4j = require("neo4j-driver");

var result = require("./result");
var gutil = require("../gutil");
var config = require("../../config.json").server;

module.exports = (function() {

    var boltUrl = "bolt://" + config.neo4j.host + ":" + config.neo4j.port;

    gutil.log("neo4j: connecting to %s", boltUrl);

    var driver = neo4j.driver(
        boltUrl,
        neo4j.auth.basic(config.neo4j.username, config.neo4j.password)
    );

    function query(cypher, callback, columns) {
        var queryStr, params = {};

        if (cypher && cypher.query) {
            queryStr = cypher.query;
            params = cypher.params || {};
        } else {
            queryStr = cypher;
        }

        // Strip trailing semicolons (e.g. from loaded .cypher files)
        if (typeof queryStr === "string") {
            queryStr = queryStr.trim().replace(/;$/, "");
        }

        gutil.log("db.query: \"%s\"".gray, queryStr);

        var timer = { command: queryStr, start: new Date().getTime() };
        var session = driver.session();

        session.run(queryStr, params)
            .then(function(neoResult) {
                session.close();
                result.process(neoResult, callback, columns, timer);
            })
            .catch(function(error) {
                session.close();
                result.handleError(error);
            });
    }

    return {
        driver: driver,
        query: query
    };

}());
