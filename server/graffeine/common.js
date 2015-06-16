
var neo           = require('neo4j');
var util          = require('util');
var software      = require('../package.json');
var db            = require('../config/neo4j.json');
var server        = require('../config/server.json');
var graphSettings = require('../config/graph.json');

var common = { 

    log: function() { 
        var message = util.format.apply(this, arguments);
        util.log('--- INFO : ' + message);
    },

    error: function() { 

        var message = util.format.apply(this, arguments);
        var args = [].slice.apply(arguments);

        //console.log(arguments);
        console.log(args);
        process.exit(-1);

        //util.log('*** ERROR : ' + util.inspect(arguments, { showHidden: true, depth: null, colors: true }));

        if(global.graffeineClientSocket!==undefined) { 
            global.graffeineClientSocket.emit('server-message', { 
                category: 'error',
                title: 'neo4j error',
                message: util.inspect(message), 
                updatedAt: new Date().getTime()
            });
        };
    },

    debug: function() { 
        var message = util.format.apply(this, arguments);
        if(server.debug) util.log('+++ DEBUG : ' + message);
    },

    timestamp: function() { 
        var now = new Date();
        return ( 
            (now.getMonth() + 1) + '/' +
            (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':' +
            ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' +
            ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds()))
        );
    },

    die: function() { 
        var message = util.format.apply(this, arguments);
        common.error(message);
        process.exit(-1);
    },

    config: function() { 
        this.graph = graphSettings.graph;
        this.nodes = graphSettings.nodes;
        this.rels  = graphSettings.rels;
        this.db = {};
        this.db.host = db.neo4j.host;
        this.db.port = db.neo4j.port;
        this.db.connectionString = 'http://' + db.neo4j.host + ':' + db.neo4j.port;
        common.log('Connecting to ' + this.db.connectionString)
        try { 
            this.db.conn = new neo.GraphDatabase({ 
                url: this.db.connectionString,
                auth: {username: db.neo4j.username, password: db.neo4j.password}
            });
        }
        catch(error) { 
            console.error("** neo4j connection: %s", error);
            process.exit(-1);
        }
        this.server = {};
        this.server.port = server.http.port;
        this.server.docRoot = server.http.docRoot;
        this.debugMode = server.debug;
    },

    handler: function(source) { 
        return function(request, response) { 
            source.serve(request, response, function (err, res) { 
                if (err) { 
                    console.error("ERROR: Problem serving " + request.url + " - " + err.message);
                    response.writeHead(err.status, err.headers);
                    response.end();
                }
                else {
                    // console.log("> " + request.url + " - " + res.message);
                }
            });
        }
    }

};

exports.log     = common.log;
exports.error   = common.error;
exports.debug   = common.debug;
exports.die     = common.die;
exports.config  = new common.config();
exports.db      = exports.config.db;
exports.handler = common.handler;
