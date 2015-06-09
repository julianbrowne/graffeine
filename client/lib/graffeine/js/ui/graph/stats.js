/**
 *  Graph Stats
 *
**/

Graffeine.ui.graphStats = (function(G) { 

    var self = this;
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
        $(data.selectors.content).modal({ keyboard: true, show: false });
    };

    return {
        show: function() { 
            $(data.selectors.content).modal('show');
        },
        hide: function() { 
            $(data.selectors.content).modal('hide');
        },
        update: function(key, value) { 
            if(data.selectors.fields[key] === undefined) return;
            $(data.selectors.fields[key]).html(value);
        },
        refresh: function() { 
            var graph = G.graph;
            $('#graph-node-count').html(Object.keys(graph.nodes()).length);
            $('#graph-node-max').html(G.config.graphSettings.nodeLimit);
            $('#graph-link-count').html(graph.paths().length);
            $('#graph-path-types-count').html(graph.pathTypes().length);
        }

    };

}(Graffeine));
