
var sio = require("socket.io");
var graph = require("./models/graph");
var nodes = require("./models/nodes");
var paths = require("./models/paths");
var gutil = require("./gutil");
var http = require("./http");
var config = require("../config/server.json");

module.exports = (function() { 

    "use strict";

    gutil.log("Starting WS server on " + config.http.port);
    var socket = sio.listen(http.listener, { log: false });

    function send(type, payload) { 
        gutil.log("sending %s", type);
        payload.timestamp = gutil.timestamp();
        socket.emit(type, payload);
    }

    return { 
        // send: send,
        socket: socket,
        server: { 
            message: function (category, title, message) { 
                send("server-message", {category: category, title: title, message: message});
            }
        },
        graph: { 
            init: function() { 
                graph.all(function(n, timer) { 
                    send("data-nodes", { nodes: n, count: n.length });
                    send("server-timer", { data: timer } );
                });
                send("graph-gists", { names: gutil.getGists() });
            },
            fetch: function(data) { 
                nodes.from(data.start, function(n, timer) { 
                    send("data-nodes", { nodes: n, root: data.start } );
                    send("server-timer", { data: timer } );
                });
            },
            load: function(name) { 
                graph.load(data.name, function(result, timer) { 
                    send("server-message", { 
                        category: "success", 
                        title: "database loaded",
                        message: "loaded " + data.name
                    });
                    send("server-timer", { data: timer } );
                });
            },
            remove: function() { 
                graph.delete(function(result, timer) { 
                    send("graph-delete", { result: result, updatedAt: graffeine.timestamp() } );
                    send("server-timer", { data: timer } );
                });
            },
            stats: function(data) { 
                nodes.count(function(count, timer) {
                    send("nodes-count", { count: count });
                    send("server-timer", { data: timer } );
                });
            }
        },
        node: { 
            add: function(data) { 
                nodes.add(data, function(node, timer) { 
                    send("node-add", { node: node } );
                    send("server-timer", { data: timer } );
                });
            },
            remove: function(data) { 
                nodes.remove(data.id, function(result, timer) { 
                    send("node-remove", { id: data.id } );
                    send("server-timer", { data: timer } );
                });
            },
            update: function(data) { 
                nodes.update(data.id, data.data, function(result, timer) { 
                    send("node-update", { id: data.id, data: result } );
                    send("server-timer", { data: timer } );
                });
            },
            find: function(data) { 
                nodes.find(data.name, data.type, function(nodes, timer) { 
                    if(nodes.length > 0) { 
                        var ids = [];
                        for(var i=0; i<nodes.length; i++) { ids.push(nodes[i].id); };
                        nodes.from(ids.join(), function(nodes) { 
                            send("data-nodes", { nodes: nodes } );
                        });
                        send("server-timer", { data: timer } );
                    }
                });
            },
            orphans: function(data) {
                nodes.orphans(function(nodes, timer) {
                    send("data-nodes", { nodes: nodes } );
                    send("server-timer", { data: timer } );
                });
            },
            join: function(data) { 
                nodes.join(data.source, data.target, data.name, function(success, timer) { 
                    if(success) { 
                        send("node-join", { source: data.source, target: data.target, name: data.name } );
                        send("server-timer", { data: timer } );
                    }
                    else {
                         graffeine.log("FAIL: node-join -> " + util.inspect(data));
                    }
                });
            }
        },
        path: { 
            all: function() { 
                paths.all(function(result, timer) { 
                    var types = result.map(function(r) { return r.type });
                    var filtered = types.sort().filter(function(el,i,a) { return (i==a.indexOf(el)); });
                    send("path-all", { data: filtered } );
                    send("server-timer", { data: timer } );
                });
            },
            remove: function(data) { 
                paths.remove(data.source, data.target, data.name, function(success, timer) { 
                    if(success) { 
                        send("path-delete", { source: data.source, target: data.target, name: data.name } );
                        send("server-timer", { data: timer } );
                    }
                    else { 
                        gutil.log("FAIL: path-delete -> " + util.inspect(data));
                    }
                });
            },
            count: function() { 
                paths.count(function(count, timer) { 
                    send("path-count", { count: count });
                    send("server-timer", { data: timer } );
                });
            }
        }
    };

}());