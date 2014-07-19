
var neo  = require('neo4j');

var graffeine = require('../package.json');
var db = require('../conf/neo4j.json');
var server = require('../conf/server.json');
var graphSettings = require('../conf/graph.json');

var common = {

    log: function(message) { 
        console.log('--- INFO : ' + message);
    },

    error: function(message) { 
        console.error('*** ERROR : ' + message);
    },

    debug: function(message) { 
        if(server.debug) console.log('--- DEBUG : ' + message);
    },

    die: function(error) { 
        common.error("*** ERROR : " + error);
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
        this.db.conn = new neo.GraphDatabase(this.db.connectionString);
        this.server = {};
        this.server.port = server.nodejs.port;
        this.debugMode = server.debug;
    }

};

exports.log    = common.log;
exports.error  = common.error;
exports.debug  = common.debug;
exports.die    = common.die;
exports.config = new common.config();
exports.db     = exports.config.db;
