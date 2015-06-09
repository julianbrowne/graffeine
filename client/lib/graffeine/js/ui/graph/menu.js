/**
 *  Node Menu
 *
 *  Node navigation Bar Menu
 *
**/

Graffeine.ui.graphMenu = (function(G) { 

    var self = this;
    var ui = G.ui;

    var data = { 
        selectors: { 
            target:  "#graph-menu-container",
            content: "#graph-menu-content",
            items: { 
                node: { 
                    add: "#node-add",
                    find: "#node-find",
                    orphans: "#node-orphans"
                },
                graph: {
                    connect: "#graph-init",
                    remove: "#graph-remove",
                }
            }
        },
        viewURL: G.config.root + "html/graph-menu.html"
    };

    init();

    function init() { 
        load(handler);
    };

    function load(callback) { 
        ui.util.loadPartial(data.viewURL, data.selectors.target, callback);
    };

    function handler() { 

        $(data.selectors.target).appendTo("#logo-menu-content > nav.navbar");

        ui.util.event(data.selectors.items.graph.connect, "click", function(e) { 
            var mode = ui.util.toggleButton(data.selectors.items.graph.connect, ["clear", "connect"]);
            if(mode==="clear")
                Graffeine.command.send("graph-init", {});
            else
                Graffeine.graph.init();
        });

        ui.util.event(data.selectors.items.node.add, 'click', function(e) { 
            ui.nodeEdit.show();
        });

        ui.util.event(data.selectors.items.node.orphans, 'click', function(e) { 
            Graffeine.command.send('nodes-orphans', { });
        });

    };

    return { 
        
    };

}(Graffeine));
