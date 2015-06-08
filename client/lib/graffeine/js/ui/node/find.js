/**
 *  Node Find
 *
 *  Find nodes in graph
 *
**/

Graffeine.ui.nodeFind = (function(G) { 

    var self = this;
    var ui = G.ui;

    var data = { 
        selectors: { 
            target:  "#node-find-container",
            content: "#node-find-content",
            buttons: { 
                save: "#node-find-save",
                cancel: "#node-find-cancel"
            },
            fields: { 
                form: "#node-find-form"
            }
        },
        viewURL: G.config.root + "html/node-find.html"
    };

    init();

    function init() { 
        load(handler);
    };

    function load(callback) { 
        ui.util.loadPartial(data.viewURL, data.selectors.target, callback);
    };

    function handler() { 

        ui.util.event(data.selectors.buttons.save, 'click', function(e) { 
        /**
            var name = $(graph.ui.labels.nodeFindName).val();
            var type = $(graph.ui.labels.nodeFindTypes).find(":selected").text();
            graph.debugMesg("(click:node:find) finding node : " + name + " of type " + type);
            Graffeine.command.send('node-find', { name: name, type: type });
        **/
        });

        /**
        $("#graph-fetch").click(function(e) { 
            var start = $('#graph-start').val();
            Graffeine.command.send('graph-fetch', { start: start });
        });
        **/

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
