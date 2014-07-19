
var neo           = require('neo4j');
var software      = require('../package.json');
var db            = require('../conf/neo4j.json');
var server        = require('../conf/server.json');
var graphSettings = require('../conf/graph.json');
var sio           = require('socket.io');

var common = { 

    log: function(message) { 
        console.log('--- INFO : ' + message);
    },

    error: function(message) { 
        console.error('*** ERROR : ' + message);
        if(global.graffeineClientSocket!==undefined) { 
            global.graffeineClientSocket.emit('server-error', { message: message, updatedAt: new Date().getTime() });
        };
    },

    debug: function(message) { 
        if(server.debug) console.log('--- DEBUG : ' + message);
    },

    die: function(message) { 
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
            this.db.conn = new neo.GraphDatabase(this.db.connectionString);
        }
        catch(error) { 
            common.die(error);
        }
        this.server = {};
        this.server.port = server.nodejs.port;
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
