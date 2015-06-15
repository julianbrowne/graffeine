/**
 *  Node Menu
 *
 *  Node Operations Menu
 *  (view, edit, delete, etc)
 *
**/

Graffeine.ui.nodeMenu = (function(G) { 

    var self = this;
    var ui = G.ui;
    var util = G.util;

    var data = { 
        selectors: { 
            target:  "#node-menu-container",
            content: "#node-menu-content",
            actions: { 
                view: "#init-node-view",
                remove: "#init-node-delete",
                clone: "#init-node-clone"
            }
        },
        viewURL: G.config.root + "html/node-menu.html"
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

        ui.util.event(data.selectors.actions.remove, 'click', function(e) { 
            if(!ui.state.nodeSelected()) { 
                console.log("node delete called but no node on the graph selected");
                return;
            }
            var nodeId = ui.state.getSelectedNode().id;
            Graffeine.command.send('node-delete', { id: nodeId });
            ui.state.unselectNode();
            ui.nodeMenu.hide();
        });

        ui.util.event(data.selectors.actions.clone, 'click', function(e) { 
            // @todo
            // var newObj = ui.util.formToObject(graph.ui.identifiers.nodeEditableData.replace(/#/,''));
            // Graffeine.command.send('node-add', newObj);
        });

        /** View node data **/

        ui.util.event(data.selectors.actions.view, 'click', function(e) { 
            ui.nodeMenu.hide();
            ui.nodeView.show();
        });

    };

    return { 
        show: function(node, element) { 
            $(data.selectors.content).modal('show');
        },
        hide: function() { 
            $(data.selectors.content).modal('hide');
        }
    };

}(Graffeine));
