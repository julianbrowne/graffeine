/**
 *  Tool Menu
 *
 *  Buttons Across Top
 *
**/

Graffeine.ui.toolMenu = (function(G) { 

    var self = this;
    var ui = G.ui;

    var data = { 
        selectors: { 
            target:  "#tool-menu-container",
            content: "#tool-menu-content",
            buttons: { 
                init:   "#graph-init",
                stats:  "#graph-stats-load",
                source: "#db-source",
                force:  "#graph-force",
                mode:   "#graph-mode"
            }
        },
        viewURL: G.config.root + "html/tool-menu.html"
    };

    init();

    function init() { 
        load(handler);
    };

    function load(callback) { 
        ui.util.loadPartial(data.viewURL, data.selectors.target, callback);
    };

    function handler() { 

        var graph = G.ui;

        $(data.selectors.target).appendTo("#logo-menu-content > nav.navbar");

        ui.util.event(data.selectors.buttons.mode, "click", function(e) { 
            var mode = ui.util.toggleButton(data.selectors.buttons.mode, ["replace", "update"]);
            graph.replace = (mode==="replace") ? true : false;
        });

        ui.util.event(data.selectors.buttons.force, "click", function(e) { 
            var mode = ui.util.toggleButton(data.selectors.buttons.force, ["force", "stop"]);
            (mode==="force") ? graph.forceStop() : graph.forceStart();
        });

        ui.util.event(data.selectors.buttons.stats, "click", function(e) { 
            Graffeine.ui.graphStats.show();
        });

        ui.util.event(data.selectors.buttons.source, "click", function(e) { 
            var mode = ui.util.toggleButton(data.selectors.buttons.source, ["local", "remote"]);
            if(mode==="local") { 
                graph.temp = graph.socket;
                graph.socket = Fake.socket;
            }
            else { 
                graph.socket = graph.temp;
                graph.temp = null;
            }
        });

    };

    return { 
        show: function() { },
        hide: function() { }
    };

}(Graffeine));
