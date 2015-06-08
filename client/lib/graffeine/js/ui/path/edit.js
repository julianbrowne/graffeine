/**
 *  Path Edit
 *
 *  Create/Edit Relationships
 *
**/

Graffeine.ui.pathEdit = (function(G) { 

    var self = this;
    var ui = G.ui;

    var data = { 
        selectors: { 
            target:  "#path-edit-container",
            content: "#path-edit-content",
            buttons: { 
                cancel: "#path-edit-cancel",
                save:   "#path-edit-save"
            },
            fields: { 
                source: "#path-edit-source",
                target: "#path-edit-target",
                relationship: "#path-edit-relationship"
            }
        },
        viewURL: G.config.root + "html/path-edit.html"
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

        ui.util.event(data.selectors.buttons.cancel, "click", function(e) { 
            ui.pathEdit.hide();
        });

        ui.util.event(data.selectors.buttons.save, "click", function(e) { 
            save();
        });

        ui.util.event(data.selectors.content, "keypress", function(e) { 
            if (e.keyCode === 13) save();
        });

        ui.util.event(data.selectors.content, "show.bs.modal", function(e) { 
            var options = ui.util.selectize(data.selectors.fields.relationship);
            ui.util.addOptionsToSelectize(options, graph.data.pathTypes);
        });

        ui.util.event(data.selectors.content, "hidden.bs.modal", function(e) { 
            ui.util.endDraglet();
        });

    };

    function save() { 
        var relationship = $(data.selectors.fields.relationship).val();
        if(relationship!=="")
            Graffeine.command.connectNodes(graph.state.sourceNode, graph.state.hoveredNode, relationship);
        ui.pathEdit.hide();
    };

    return { 

        show: function(source, target) { 
            graph.state.newPathActive = true; // @todo: global
            $(data.selectors.fields.source).val(source.getName());
            $(data.selectors.fields.target).val(target.getName());
            $(data.selectors.content).modal('show');
        },

        hide: function() { 
            $(data.selectors.content).modal('hide');
        }

    };

}(Graffeine));
