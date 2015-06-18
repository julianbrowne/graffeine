
var sio = require('socket.io');
var graph = require('./models/graph');
var nodes = require('./models/nodes');
var paths = require('./models/paths');
var gutil = require("./gutil");
var http = require("./http");
var config = require("../config/server.json");

module.exports = (function() { 

    gutil.log('Starting WS server on ' + config.http.port);
    var socket = sio.listen(http.listener, { log: false });

    function send(type, payload) { 
        gutil.log("sending %s", type);
        payload.timestamp = gutil.timestamp();
        socket.emit(type, payload);
    };

    return { 
        // send: send,
        // socket: socket,
        server: { 
            message: function (category, title, message) { 
                send("server-message", {category: category, title: title, message: message});
            },
            timer: function (message) { 
                send("server-timer", message);
            }
        },
        graph: { 
            init: function() { 
                graph.all(function(nodes) { 
                    send("data-nodes", { nodes: nodes, count: nodes.length });
                });
                send("graph-gists", { names: gutil.getGists() });
            },
            fetch: function(data) { 
                nodes.from(data.start, function(nodes) { 
                    send('data-nodes', { nodes: nodes, root: data.start, updatedAt: new Date().getTime() } );
                });
            },
            load: function(name) { 
                graph.load(data.name, function(result) { 
                    send("server-message", { 
                        category: "success", 
                        title: 'database loaded',
                        message: "loaded " + data.name, 
                        updatedAt: new Date().getTime()
                    });
                });
            },
            remove: function() { 
                graph.delete(function(result) { 
                    send('graph-delete', { result: result, updatedAt: graffeine.timestamp() } );
                });
            },
            stats: function(data) { 
                nodes.count(function(count) {
                    send('nodes-count', { count: count });
                });
            }
        },
        node: { 
            add: function(data) { 
                nodes.add(data, function(node) { 
                    send('node-add', { node: node, updatedAt: new Date().getTime() } );
                });
            },
            remove: function(data) { 
                nodes.remove(data.id, function(result) { 
                    send('node-delete', { id: data.id, updatedAt: new Date().getTime() } );
                });
            },
            update: function(data) { 
                nodes.update(data.id, data.data, function(result) { 
                    send('node-update', { id: data.id, data: result, updatedAt: new Date().getTime() } );
                });
            },
            find: function(data) { 
                nodes.find(data.name, data.type, function(nodes) { 
                    if(nodes.length > 0) { 
                        var ids = [];
                        for(var i=0; i<nodes.length; i++) { ids.push(nodes[i].id); };
                        nodes.from(ids.join(), function(nodes) { 
                            send('data-nodes', { nodes: nodes, updatedAt: new Date().getTime() } );
                        });
                    }
                });
            },
            orphans: function(data) {
                nodes.orphans(function(nodes) {
                    send('data-nodes', { nodes: nodes, updatedAt: new Date().getTime() } );
                });
            },
            join: function(data) { 
                nodes.join(data.source, data.target, data.name, function(success) { 
                    if(success) { 
                        send('node-join', { source: data.source, target: data.target, name: data.name, updatedAt: new Date().getTime() } );
                    }
                    else {
                         graffeine.log('FAIL: node-join -> ' + util.inspect(data));
                    }
                });
            }
        },
        path: { 
            all: function() { 
                paths.all(function(result) { 
                    var types = result.map(function(r) { return r.type });
                    var filtered = types.sort().filter(function(el,i,a) { return (i==a.indexOf(el)); });
                    send('path-all', { data: filtered, updatedAt: new Date().getTime() } );
                });
            },
            remove: function(data) { 
                paths.remove(data.source, data.target, data.name, function(success) {
                    if(success) { 
                        send('path-delete', { source: data.source, target: data.target, name: data.name, updatedAt: new Date().getTime() } );
                    }
                    else { 
                        gutil.log('FAIL: path-delete -> ' + util.inspect(data));
                    }
                });
            },
            count: function() { 
                paths.count(function(count) { 
                    send('path-count', { count: count, updatedAt: new Date().getTime() });
                });
            }
        }
    };

}());