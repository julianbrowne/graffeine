
var bus = require("postal");

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
            message: function (category, title, message) { 
                send("server", "info", {category: category, title: title, message: message});
            }
        },
        graph: { 
            init: function() { 
                graph.all(function(n, timer) { 
                    send("graph", "nodes", { nodes: n, count: n.length });
                    send("server", "timer", { data: timer } );
                    send("graph", "gists", { names: gutil.getGists() });
                });
            },
            nodes: function() { 
                graph.nodes(function(result, timer) { 
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
            load: function(name) { 
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
            update: function(data) { 
                nodes.update(data.id, data.data, function(result, timer) { 
                    send("nodes","update", { id: data.id, data: result } );
                    send("server","timer", { data: timer } );
                });
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
            add: function(data) { 
                paths.join(data.source, data.target, data.name, function(success, timer) { 
                    if(success) { 
                        send("paths","add", { source: data.source, target: data.target, name: data.name } );
                        send("server","timer", { data: timer } );
                    }
                    else {
                         graffeine.log("FAIL: node-join -> " + util.inspect(data));
                    }
                });
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
                    send("paths","count", { count: count });
                    send("server","timer", { data: timer } );
                });
            }
        }
    };

}());