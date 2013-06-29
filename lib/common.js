
var neo  = require('neo4j');
require('js-yaml');

var common = {

    log: function(message) {
        console.log('--- INFO : ' + message);
    },

    die: function(error) {
        console.log("*** ERROR : " + error);
        process.exit(-1);
    },

    loadConfig: function(file) {
        var confHome = '../conf/';
        try {
          var doc = require(confHome + file);
          return doc;
        }
        catch (e) {
          console.log(e);
          process.exit(1);
        }
    },

    config: function() {
        var graphSettings = common.loadConfig('graph.yml');
        this.graph = graphSettings.graph;
        this.nodes = graphSettings.nodes;
        this.rels  = graphSettings.rels;

        var db = common.loadConfig('neo4j.yml');
        this.db = {};
        this.db.host = db.neo4j.host;
        this.db.port = db.neo4j.port;
        this.db.connectionString = 'http://' + db.neo4j.host + ':' + db.neo4j.port;
        common.log('Connecting to ' + this.db.connectionString)
        this.db.conn = new neo.GraphDatabase(this.db.connectionString);

        var server = common.loadConfig('server.yml');
        this.server = {};
        this.server.port = server.nodejs.port;

    }

};

exports.log    = common.log;
exports.config = new common.config();
exports.db     = exports.config.db;
exports.die    = common.die;
