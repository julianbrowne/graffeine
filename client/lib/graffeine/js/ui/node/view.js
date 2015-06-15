/**
 *  Node View
 *
 *  Read-only Node Data View Modal
 *
**/

Graffeine.ui.nodeView = (function(G) { 

    var ui = G.ui;

    var data = { 
        selectors: { 
            target:  "#node-view-container",
            content: "#node-view-content",
            fields: {
                body: "#node-view-body"
            }
        },
        viewURL: G.config.root + "html/node-view.html"
    };

    init();

    function init() { 
        load(handler);
    };

    function load(callback) { 
        ui.util.loadPartial(data.viewURL, data.selectors.target, callback);
    };

    function handler() { 

        var ui = G.ui;
        var util = G.util;

        ui.util.modal(data.selectors.content);

        ui.util.event(data.selectors.content, "show.bs.modal", function(e) { 
            var node = ui.state.getSelectedNode();
            console.log(node);
            var table = util.objToList(node);
            $(data.selectors.fields.body).empty();
            $(data.selectors.fields.body).append(table);
        });

    };

    return { 
        show: function(node) { 
            $(data.selectors.content).modal('show');
        },
        hide: function() { 
            $(data.selectors.content).modal('hide');
        }
    };

}(Graffeine));
