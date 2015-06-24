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
        console.log("recv: registering \"%s\" callback", command);
        var visualUpdate = (visualUpdate===undefined) ? false : true;
        G.socket().on(command, function(data) { 
            console.log("recv: recorded %s event", command);
            // @todo find a way to make this cleaner
            // if(visualUpdate) send('graph:stats', {});
            callback(data);
        });
    };

    function connectNodes(sourceNode, targetNode, name) { 
        if(!sourceNode||!sourceNode.id||!targetNode||!targetNode.id||!name) { 
            console.warn("connectNodes: can't join nodes %s to %s with %s", sourceNode, targetNode, name);
            return;
        }
        send('paths:add', { source: sourceNode.id, target: targetNode.id, name: name });
    };

    function gatherDBStats() { 
        send("graph:paths");
    };

    function graphLoad(name) { 
        send("graph:load", {name: name});
    };

    function registerReceivers() { 

        var ui = G.ui;
        var util = G.util;
        var graph = G.graph;

        console.log("command: registerReceivers");

        recv("server:timer", function (timer) { 
            var message = "last query \"" + timer.data.command + "\" took " + timer.data.time + " ms";
            ui.util.updateFlash("info", "timer", message);
        });

        /**
         *  List the graph databases the server can build
        **/

        recv("graph:gists", function (data) { 
            Graffeine.set("gists", data.names);
        });

        recv("graph:nodes", function (data) { 
            graph.addGraphData(data);
            graph.refresh();
        });

        /**
         *  Join nodes
        **/

        recv("paths:add", function (data) { 
            graph.addPath(data.source, data.target, data.name);
            graph.refresh();
        }, true);

        // stats - node count

        recv('nodes:count', function (data) { 
            Graffeine.ui.graphStats.update('nodeCount', data.count);
        });

        /**
         *  Path (Relationship) Commands
        **/

        recv('paths:count', function (data) { 
            Graffeine.ui.graphStats.update('pathCount', data.count);
        });

        recv("graph:paths", function (data) { 
            Graffeine.ui.graphStats.update("dbPathTypes", data.data);
        }, true);

        // delete existing node

        recv('nodes:remove', function (data) { 
            graph.removeNode(data.id);
            graph.refresh();
        }, true);

        /**
         *  New node
        **/

        recv("nodes:add", function (data) { 
            graph.addNode(data.node);
            graph.refresh();
        }, true);

        /**
         *  Update node
        **/

        recv("nodes:update", function (data) { 
            graph.addNode(data.data);
            graph.resetPaths();
            graph.refresh();
        }, false);

        /**
         *  Delete path
        **/

        recv("paths:remove", function (data) { 
            graph.removePath(data.source, data.target, data.name);
            graph.refresh();
        }, true);

        /**
         *  handle server-side messages (errors, alerts, warnings)
        **/

        recv('server:info', function (data) { 
            ui.util.updateFlash(data.category, data.title, data.message);
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