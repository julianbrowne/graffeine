/**
 *  Logo Menu
 *
 *  Logo and dropdown menu
 *
**/

Graffeine.ui.logoMenu = (function(G) { 

    var self = this;
    var ui = G.ui;

    var data = { 
        selectors: { 
            target:  "#logo-menu-container",
            content: "#logo-menu-content"
        },
        viewURL: G.config.root + "html/logo-menu.html"
    };

    init();

    function init() { 
        load(handler);
    };

    function load(callback) { 
        ui.util.loadPartial(data.viewURL, data.selectors.target, callback);
    };

    function handler() { 
    };

    return { 
        show: function() { },
        hide: function() { }
    };

}(Graffeine));
