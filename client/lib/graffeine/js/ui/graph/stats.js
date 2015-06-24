/**
 *  Graph Stats Modal
**/

Graffeine.ui.graphStats = (function(G) { 

    var ui = G.ui;

    var data = { 
        selectors: { 
            target:  "#graph-stats-container",
            content: "#graph-stats-content",
            buttons: { 
            },
            fields: { 
                nodeCount: "#graph-stats-node-count",
                pathCount: "#graph-stats-path-count",
                dbPathTypes: "#db-path-types-list"
            }
        },
        viewURL: G.config.root + "html/graph-stats.html"
    };

    init();

    function init() { 
        load(handler);
    };

    function load(callback) { 
        ui.util.loadPartial(data.viewURL, data.selectors.target, callback);
    };

    function handler() { 
        ui.util.modal(data.selectors.content);
    };

    return {
        show: function() { 
            ui.state.setMenuActive();
            $(data.selectors.content).modal('show');
        },
        hide: function() { 
            $(data.selectors.content).modal('hide');
            ui.state.unsetMenuActive();
        },
        update: function(key, value) { 
            if(data.selectors.fields[key] === undefined) { 
                console.warn("graphStats.update: can't update %s with %s: no selector", key, value);
                return;
            }
            if(G.util.getType(value)==="array") var value = value.join(", ");
            console.log("graphStats.update: updating %s with %s", key, value);
            $(data.selectors.fields[key]).html(value);
        },
        clear: function() { 
            console.log("clearing graph stats");
            $(".stats").empty();
        },
        refresh: function() { 
            var graph = G.graph;
            $("#graph-node-count").html(Object.keys(graph.nodes()).length);
            $("#graph-node-max").html(G.config.graphSettings.nodeLimit);
            $("#graph-link-count").html(graph.paths().length);
            $("#graph-path-types-count").html(graph.getPathTypes().length);
            $("#node-labels-list").html(graph.getNodeLabels().join(", "));
            $("#node-types-list").html(graph.getNodeTypes().join(", "));
            $("#path-types-list").html(graph.getPathTypes().join(", "));
        }

    };

}(Graffeine));
