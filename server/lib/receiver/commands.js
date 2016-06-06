
var util = require("util");

var bus = require("postal");
var schema = require("js-schema");

var config = require("../../config/server.json");
var gutil = require("../gutil");
var graph = require("../models/graph");
var nodes = require("../models/nodes");
var paths = require("../models/paths");

module.exports = (function() { 

    "use strict";

    function send(channel, topic, message) { 
        bus.publish({ channel: channel, topic: topic, data: message });
    };

    return { 
        server: { 
            message: function(category, title, message) { 
                send("server", "info", {category: category, title: title, message: message});
            },
            info: function() { 
                send("server", "info", {category: "info", title: "Server", message: config.version.join(".") })
            },
            timer: function() { 
                send("server", "timer", { data: graffeine.timestamp() } );
            }
        },
        graph: { 

            ping: function() { 
                graph.ping(function(nodes) { 
                    send("server", "info", {category: "info", title: "Ping", message: "Neo4J is alive"});
                });
            },

            init: function() { 
                graph.all(function(n, timer) { 
                    send("graph", "nodes", { nodes: n, count: n.length });
                    send("server", "timer", { data: timer } );
                    send("graph", "gists", { names: gutil.getGists() });
                    if(n.length === 0) { 
                        send("server", "info", {category: "info", title: "Query", message: "last query had 0 results"});
                    }
                });
            },

            gists: function() { 
                send("graph", "gists", { names: gutil.getGists() });
            },

            nodes: function() { 
                graph.nodes(function(result, timer) { 
                    var types = result.map(function(r) { return r.type });
                    var filtered = types.sort().filter(function(el,i,a) { return (i==a.indexOf(el)); });
                    send("graph", "nodes", { nodes: filtered, count: n.length } );
                    send("server", "timer", { data: timer } );
                    if(filtered.length === 0) { 
                        send("server", "info", {category: "info", title: "Query", message: "last query had 0 results"});
                    }
                });
            },

            paths: function() { 
                graph.paths(function(result, timer) { 
                    var types = result.map(function(r) { return r.type });
                    var filtered = types.sort().filter(function(el,i,a) { return (i==a.indexOf(el)); });
                    send("graph", "paths", { data: filtered } );
                    send("server", "timer", { data: timer } );
                });
            },
            fetch: function(data) { 
                nodes.from(data.start, function(n, timer) { 
                    send("graph", "nodes", { nodes: n, root: data.start } );
                    send("server", "timer", { data: timer } );
                });
            },
            load: function(data) { 
                graph.load(data.name, function(result, timer) { 
                    send("server","info", { 
                        category: "success", 
                        title: "database loaded",
                        message: "loaded " + data.name
                    });
                    send("server","timer", { data: timer } );
                });
            },
            remove: function() { 
                graph.remove(function(result, timer) { 
                    send("graph","remove", { result: result, updatedAt: graffeine.timestamp() } );
                    send("server","timer", { data: timer } );
                });
            },
            stats: function(data) { 
                nodes.count(function(count, timer) {
                    send("nodes","count", { count: count });
                    send("server","timer", { data: timer } );
                });
            }
        },
        nodes: { 
            add: function(data) { 
                nodes.add(data, function(node, timer) { 
                    send("nodes","add", { node: node } );
                    send("server","timer", { data: timer } );
                });
            },
            remove: function(data) { 
                nodes.remove(data.id, function(result, timer) { 
                    send("nodes","remove", { id: data.id } );
                    send("server","timer", { data: timer } );
                });
            },

            update: function(payload) { 
                var validSchema = schema({ id: Number, data: { "?properties": Object, "?labels": Array } });
                if(!validSchema(payload)) { 
                    gutil.error("nodes:update - got bad data: %s", JSON.stringify(payload));
                    gutil.error("nodes:update - %s", JSON.stringify(validSchema.errors(payload)));
                }
                else { 
                    nodes.update(payload.id, payload.data.properties, payload.data.labels, function(resultList, timer) { 
                        var updatedNode = resultList[0];
                        var validResultSchema = schema({ data: Object, id: Number, labels: Array, node: String });
                        if(!validResultSchema(updatedNode)) { 
                            gutil.error("nodes:update - unexpected result: %s", JSON.stringify(updatedNode));
                            gutil.error("nodes:update - %s", JSON.stringify(validResultSchema.errors(updatedNode)));
                        }
                        else { 
                            gutil.log("nodes:update - result: %s", JSON.stringify(updatedNode));
                            send("nodes","update", { id: updatedNode.id, properties: updatedNode } );
                            send("server","timer", { data: timer } );
                        }
                    });
                }
            },

            find: function(data) { 
                nodes.find(data.name, data.type, function(nodes, timer) { 
                    if(nodes.length > 0) { 
                        var ids = [];
                        for(var i=0; i<nodes.length; i++) { ids.push(nodes[i].id); };
                        nodes.from(ids.join(), function(nodes) { 
                            send("graph", "nodes", { nodes: nodes } );
                        });
                        send("server", "timer", { data: timer } );
                    }
                });
            },
            orphans: function(data) {
                nodes.orphans(function(nodes, timer) { 
                    send("graph", "nodes", { nodes: nodes } );
                    send("server","timer", { data: timer } );
                });
            },
        },

        paths: { 
            add: function(payload) { 
                var validSchema = schema({ source: Number, target: Number, name: String });
                if(!validSchema(payload)) { 
                    gutil.error("paths:add - got bad data: %s", JSON.stringify(payload));
                    gutil.error("paths:add - %s", JSON.stringify(validSchema.errors(payload)));                    
                }
                else { 
                    paths.add(payload.source, payload.target, payload.name, function(success, timer) { 
                        if(success) { 
                            send("paths", "add", { source: payload.source, target: payload.target, name: payload.name } );
                            send("server", "timer", { data: timer } );
                        }
                        else { 
                             gutil.log("paths:add - error: " + util.inspect(payload));
                        }
                    });
                }
            },

            remove: function(data) { 
                paths.remove(data.source, data.target, data.name, function(success, timer) { 
                    if(success) { 
                        send("paths", "remove", { source: data.source, target: data.target, name: data.name } );
                        send("server", "timer", { data: timer } );
                    }
                    else { 
                        gutil.log("FAIL: path-delete -> " + util.inspect(data));
                    }
                });
            },
            count: function() { 
                paths.count(function(count, timer) { 
                    send("paths", "count", { count: count });
                    send("server", "timer", { data: timer } );
                });
            }
        }
    };

}());
