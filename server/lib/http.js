
var path = require('path');
var appDir = path.dirname(require.main.filename);
var http = require('http');
var content = require('node-static');
var gutil = require("./gutil");
var config = require("../config/server.json");

module.exports = (function() { 

    var rootDir = appDir + "/../" + config.http.public;
    var docs = new(content.Server)(rootDir);
    var app = http.createServer(requestHandler(docs));
    gutil.log("http: starting server for %s", rootDir);
    app.listen(config.http.port);
    gutil.log("http: open browser to %s:%s", config.http.host, config.http.port);

    function requestHandler(docs) { 
        return function(request, response) { 
            docs.serve(request, response, function (err, res) { 
                if (err) { 
                    gutil.error("http: error serving %s: %s", request.url, err.message);
                    response.writeHead(err.status, err.headers);
                    response.end();
                }
                else { 
                    gutil.log("http: %s: %s", request.url, res.message);
                }
            });
        }
    };

    return { 
        listener: app
    };

}());