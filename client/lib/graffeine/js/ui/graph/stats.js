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
                pathCount: "#graph-stats-path-count"
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
            if(data.selectors.fields[key] === undefined) return;
            $(data.selectors.fields[key]).html(value);
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
