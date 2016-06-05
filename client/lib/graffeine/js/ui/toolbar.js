/**
 *  Tool Menu
 *
 *  Buttons Across Top
 *
**/

Graffeine.ui.toolbar = (function(G) { 

    var self = this;
    var ui = G.ui;

    var data = { 
        selectors: { 
            target:  "#toolbar-container",
            content: "#toolbar-content",
            logoMenu: { 
                content: "#about-content"
            },
            graphMenu: { 
                initGraph: "#init-graph",
                clearGraph: "#init-graph-clear",
                initStats: "#init-stats",
                setttings: "#init-settings"
            },
            nodeMenu: { 
                nodeAdd: "#node-add",
                nodeFind: "#node-find",
                nodeOrphans: "#node-orphans"
            },
            buttons: { 
                force: "#graph-force",
                mode: "#graph-mode"
            }
        },
        viewURL: G.config.root + "html/toolbar.html"
    };

    init();

    function init() { 
        load(handler);
    };

    function load(callback) { 
        if(typeof _Graffeine_Test_Mode === "boolean" && _Graffeine_Test_Mode === true) return;
        ui.util.loadPartial(data.viewURL, data.selectors.target, callback);
    };

    function handler() { 

        var graph = G.graph;
        var util = G.util;

        /**
         *  About Menu
        **/

        ui.util.modal(data.selectors.logoMenu.content);

        /**
         * Toolbar buttons on the top right
        **/

        ui.util.event(data.selectors.buttons.mode, "click", function(e) { 
            var mode = ui.util.toggleButton(data.selectors.buttons.mode, ["replace", "update"]);
            graph.replace = (mode==="replace") ? true : false;
        });

        /**
         *  Force Button On/Off
        **/

        ui.util.event(data.selectors.buttons.force, "click", function(e) { 
            if(ui.state.forceActive())
                G.svg.forceStop();
            else
                G.svg.forceStart();
        });

        /**
         *  Logo Menu drop-down options
        **/

        /**
         *  Graph Menu drop-down options
        **/

        ui.util.event(data.selectors.graphMenu.initGraph, "click", function(e) { 
            G.command.send("graph:init", {});
            G.command.gatherDBStats();
        });

        ui.util.event(data.selectors.graphMenu.clearGraph, "click", function(e) { 
            graph.clear();
            ui.graphStats.clear();
        });

        ui.util.event(data.selectors.graphMenu.initStats, "click", function(e) { 
            ui.graphStats.show();
        });

        /**
         *  Graffeine settings
        **/

        ui.util.event(data.selectors.graphMenu.setttings, "click", function(e) { 
            var container = $("<div>");
            if(G.settings.gists.length===0) { 
                G.util.log("No gists received from server");
            }
            var select = ui.util.dynamicSelect("graph-gist-name", G.settings.gists);
            var button = $("<button>").attr("id", "init-graph-gist-load").html("initialise");
            container.append(select);
            container.append(button);
            var modal = ui.util.dynamicModal("Graffeine Settings", container);
            ui.util.event(modal, "show.bs.modal", function(e) { 
                var modalId = e.currentTarget.id;
                ui.util.highlightModalCode(modal);
                $("#init-graph-gist-load").on("click", function(e) { 
                    var gistName = $("#graph-gist-name").val();
                    if(!G.util.isEmpty(gistName)) { 
                        G.command.graphLoad(gistName);
                        G.graph.clear();
                    }
                    else { 
                        G.util.log("Tried to load gist '%s'", gistName);
                    }
                    $("#"+modalId).modal("hide");
                });
            });
        });

        /**
         *  Node Menu drop-down options
        **/

        ui.util.event(data.selectors.nodeMenu.nodeAdd, 'click', function(e) { 
            // @todo: set up new (empty) node here;
            ui.nodeEdit.show();
        });

        ui.util.event(data.selectors.nodeMenu.nodeFind, 'click', function(e) { 
            // show find node menu
            // send find node command
        });

        ui.util.event(data.selectors.nodeMenu.nodeOrphans, 'click', function(e) { 
            Graffeine.command.send('nodes:orphans', { });
        });

        /** disable buttons that rely on a graph being present **/

        ui.util.disableGraphButtons();

    };

    return { 
        show: function() { },
        hide: function() { }
    };

}(Graffeine));
