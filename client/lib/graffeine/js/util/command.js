/**
 *  Command Manager
**/

Graffeine.command = (function(G) { 

    function send(command, data) { 
        if(typeof _Graffeine_Test_Mode === "boolean" && _Graffeine_Test_Mode === true) return;
        G.socket().emit(command, data);
    };

    function recv(command, callback, visualUpdate) { 
        if(G.socket()._callbacks && G.socket()._callbacks[command]) { 
            console.warn("recv: \"%s\" callback already registered", command);
            return;
        }
        G.util.debug("util.command.recv: register: \"%s\" callback", command);
        var visualUpdate = (visualUpdate===undefined) ? false : true;
        G.socket().on(command, function(data) { 
            G.util.debug("recv: recorded %s event", command);
            // @todo find a way to make this cleaner
            // if(visualUpdate) send("graph:stats", {});
            callback(data);
        });
    };

    function connectNodes(sourceNode, targetNode, name) { 
        G.util.log("connectNodes: source %s", JSON.stringify(sourceNode));
        G.util.log("connectNodes: target %s", JSON.stringify(targetNode));
        G.util.log("connectNodes: relation %s", name);
        send("paths:add", { source: sourceNode.id, target: targetNode.id, name: name });
    };

    function gatherDBStats() { 
        send("graph:paths");
    };

    function graphLoad(name) { 
        send("graph:load", {name: name});
    };

    function graphGists() { 
        send("graph:gists", {});
    };

    function graphPing() { 
        send("graph:ping", {});
    };

    function registerReceivers() { 

        var ui = G.ui;
        var util = G.util;
        var graph = G.graph;

        graphPing();

        /**
         *  server messages (errors, alerts, warnings)
        **/

        recv("server:info", function (data) { 
            ui.util.updateFlash(data.category, data.title, data.message);
        });

        /**
         *  server timers for command latency
        **/

        recv("server:timer", function (timer) { 
            var message = "last query \"" + timer.data.command + "\" took " + timer.data.time + " ms";
            ui.util.updateFlash("info", "timer", message);
        });

        /**
         *  list graph databases the server can build
        **/

        recv("graph:gists", function (data) { 
            Graffeine.set("gists", data.names);
        });

        graphGists(); // ask for available gists

        /**
         *  incoming graph data
        **/

        recv("graph:nodes", function (data) { 
            graph.addGraphData(data);
            graph.refresh();
        });

        recv("graph:paths", function (data) { 
            Graffeine.ui.graphStats.update("dbPathTypes", data.data);
        }, true);

        // stats - node count

        recv("nodes:count", function (data) { 
            Graffeine.ui.graphStats.update("nodeCount", data.count);
        });

        // delete existing node

        recv("nodes:remove", function (data) { 
            graph.removeNode(data.id);
            graph.refresh();
        }, true);

        /**
         *  New node(s)
         *
         *  data: {"node":[{"data":{"name":"frank"},"id":969,"labels":[],"node":"n"}]}
        **/

        recv("nodes:add", function (data) { 
            data.node.forEach(function(nodeData) { 
                graph.addNode(nodeData);
                graph.refresh();
            });
        }, true);

        /**
         *  Update node
         *  @payload { id: 999, properties: {} }
        **/

        recv("nodes:update", function (payload) { 
            graph.updateNode(payload.id, payload.properties);
            graph.resetPaths();
            graph.refresh();
        }, false);

        /**
         *  add new path between nodes
        **/

        recv("paths:add", function (data) { 
            graph.addPath(data.source, data.target, data.name);
            graph.refresh();
        }, true);

        /**
         *  remove path
        **/

        recv("paths:remove", function (data) { 
            graph.removePath(data.source, data.target, data.name);
            graph.refresh();
        }, true);

        /**
         *  incoming count of number of relationships in the db
        **/

        recv("paths:count", function (data) { 
            Graffeine.ui.graphStats.update("pathCount", data.count);
        });

    }

    return { 
        init: registerReceivers,
        send: send,
        connectNodes: connectNodes,
        gatherDBStats: gatherDBStats,
        graphLoad: graphLoad
    };

}(Graffeine));