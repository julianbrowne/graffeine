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
            // @todo find a way to make this cleaner
            // if(visualUpdate) send('graph-stats', {});
            callback(data);
        });
    };

    function connectNodes(sourceNode, targetNode, name) { 
        if(!sourceNode||!sourceNode.id||!targetNode||!targetNode.id||!name) { 
            console.warn("connectNodes: can't join nodes %s to %s with %s", sourceNode, targetNode, name);
            return;
        }
        send('node-join', { source: sourceNode.id, target: targetNode.id, name: name });
    };

    function graphFetch(data) { 
        send('graph-fetch', data);
    };

    function gatherDBStats() { 
        send("path-all");
    };

    function registerReceivers() { 

        var ui = G.ui;
        var util = G.util;
        var graph = G.graph;

        console.log("command: registerReceivers");

        /**
         *  List the graph databases the server can build
        **/

        recv("graph-dbs", function (data) { 
            Graffeine.set("dbs", data.names);
        });

        recv("data-nodes", function (data) { 
            console.log(data);
            graph.addGraphData(data);
            graph.refresh();
        });

        // join nodes

        recv("node-join", function (data) { 
            graph.addPath(data.source, data.target, data.name);
            graph.refresh();
        }, true);

        // stats - node count

        recv('nodes-count', function (data) { 
            util.debug("(nodes-count) processing");
            Graffeine.ui.graphStats.update('nodeCount', data.count);
        });

        /**
         *  Path (Relationship) Commands
        **/

        recv('path-count', function (data) { 
            util.debug("(path-count) processing");
            Graffeine.ui.graphStats.update('pathCount', data.count);
        });

        recv("path-all", function (data) { 
            util.debug("command: path-all: processing %s", data.data.join(","));
            Graffeine.ui.graphStats.update("dbPathTypes", data.data);
        }, true);

        // delete existing node

        recv('node-delete', function (data) { 
            util.debug("(node-delete) processing");
            graph.removeNode(data.id);
            graph.refresh();
        }, true);

        /**
         *  New node
        **/

        recv("node-add", function (data) { 
            console.log("(node-add) processing -->");
            console.log(data);
            graph.addNode(data.node);
            graph.refresh();
        }, true);

        /**
         *  Update node
        **/

        recv("node-update", function (data) { 
            console.log("(node-update) processing -->");
            console.log(data);
            graph.addNode(data.data);
            graph.resetPaths();
            graph.refresh();
        }, false);

        /**
         *  Delete path
        **/

        recv("path-delete", function (data) { 
            util.debug("(path-delete) processing");
            graph.removePath(data.source, data.target, data.name);
            graph.refresh();
        }, true);

        /**
         *  handle server-side messages (errors, alerts, warnings)
        **/

        recv('server-message', function (data) { 
            var alertClass = (data.category==="error") ? "alert-danger" : "";
            var container = $("<div>")
                .addClass("alert alert-dismissible " + alertClass)
                .attr("role", "alert");
            var closeButton = $("<button>")
                .attr("type", "button")
                .addClass("close")
                .attr("data-dismiss", "alert")
                .attr("aria-label", "close");
            var span = $("<span>")
                .attr("aria-hidden", "true")
                .html("&times;");
            var title = $("<h5>").html();
            closeButton.append(span);
            container.append(closeButton);
            container.append("<strong>"+data.title+": </strong>"+data.message);
            if($("#flash").length===0) util.warning("warning: no flash for server message");
            $("#flash").append(container);
        });

    }

    return { 
        init: registerReceivers,
        send: send,
        connectNodes: connectNodes,
        gatherDBStats: gatherDBStats
    };

}(Graffeine));