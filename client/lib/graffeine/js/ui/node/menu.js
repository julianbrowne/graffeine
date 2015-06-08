/**
 *  Node Menu
 *
 *  Node navigation Bar Menu
 *
**/

Graffeine.ui.nodeMenu = (function(G) { 

    var self = this;
    var ui = G.ui;

    var data = { 
        selectors: { 
            target:  "#node-menu-container",
            content: "#node-menu-content",
            buttons: { 
            },
            items: { 
                add: "#node-menu-add",
                find: "#node-menu-find",
                orphans: "#node-menu-orphans"
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

        $(data.selectors.target).appendTo("#logo-menu-content > nav.navbar");

        ui.util.event(data.selectors.items.add, 'click', function(e) { 
            ui.nodeEdit.show();
        });

        ui.util.event(data.selectors.items.orphans, 'click', function(e) { 
            Graffeine.command.send('nodes-orphans', { });
        });

    };

    return { 
        
    };

}(Graffeine));
