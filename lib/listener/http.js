
var fs = require("fs");
var path = require("path");
var http = require("http");
var serveStatic = require("serve-static");
var finalhandler = require("finalhandler");

var config = require("../../config.json").server;
var gutil = require("../gutil");

module.exports = (function() {

    var appDir = path.dirname(require.main.filename);
    var rootDir = path.resolve(appDir, config.http.public);

    gutil.log("http: static root resolved to %s", rootDir);

    if (!fs.existsSync(rootDir)) {
        gutil.die("http: static root does not exist: %s", rootDir);
    }

    var serve = serveStatic(rootDir, { index: ["index.html", "index.htm"] });

    var app = http.createServer(function(request, response) {
        var start = Date.now();
        serve(request, response, finalhandler(request, response, {
            onerror: function(err) {
                gutil.error("http: %s %s -> %s %s", request.method, request.url, err.status, err.message);
            }
        }));
        response.on("finish", function() {
            gutil.log("http: %s %s -> %s (%dms)", request.method, request.url, response.statusCode, Date.now() - start);
        });
    });

    app.listen(config.http.port, config.http.host, function() {
        gutil.log("http: listening on http://%s:%s", config.http.host, config.http.port);
    });

    return {
        listener: app
    };

}());
