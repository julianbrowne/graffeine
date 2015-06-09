/**
 *  Node Edit
 *
 *  Edit node JSON
 *
**/

Graffeine.ui.nodeEdit = (function(G) { 

    var self = this;
    var ui = G.ui;

    var data = { 
        selectors: { 
            target:  "#node-edit-container",
            content: "#node-edit-content",
            buttons: { 
                save: "#node-edit-save",
                cancel: "#node-edit-cancel"
            },
            fields: { 
                form: "#node-edit-form",
                nodeName: "#node-edit-name",
                nodeTypeInput: "#node-edit-type-input",
                nodeTypeSelect: "#node-edit-type-select"
            }
        },
        viewURL: G.config.root + "html/node-edit.html"
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

        /// @todo: add node to ..

        ui.util.event(data.selectors.buttons.save, 'click', function(e) { 
            var nodeName = $(data.selectors.fields.nodeName).val();
            var nodeType = $(data.selectors.fields.nodeTypeInput).val() !== '' ? $(data.selectors.fields.nodeTypeInput).val() : $(data.selectors.fields.nodeTypeSelect).find(":selected").text();
            Graffeine.command.send('node-add', { type: nodeType, name: nodeName });
            $(data.selectors.fields.nodeName).val('');
            $(data.selectors.fields.nodeTypeInput).val('');
            Graffeine.ui.nodeEdit.hide();
            graph.addNodeType(nodeType);
        });

        // @todo: .. merge with change node ..

        $("#node-edit-update").click(function(e) {
            var newObj = Graffeine.util.formToObject('node-data');
            var nodeId = graph.state.selectedNode.data.id;
            Graffeine.command.send('node-update', { id: nodeId, data: newObj });
        });

    };

    function addUniqueSelectOption(select, value, text) { 
        if(!$(select + " option[value='" + value + "']").length) {
             $(select).append($("<option></option>").attr("value", value).text(text));
        }
    };

    return { 

        show: function(node) { 
            var graph = G.graph;
            if(!node) node = new Graffeine.model.Node();
            $(data.selectors.fields.form).html(
                Graffeine.util.objToForm(node.data, { type: { 
                    data: graph.nodeTypes(), 
                    user: true, selected: node.type 
                }})
            );
            ui.util.disableActionButtons();
            $(data.selectors.content).modal('show');
        },

        hide: function() { 
            $(data.selectors.content).modal('hide');
            ui.enableActionButtons();
        },

        updateNodeTypes: function() { 
            var graph = G.graph;
            $(data.selectors.fields.nodeTypeSelect).empty();
            $.each(graph.nodeTypes(), function(key, value) { 
                addUniqueSelectOption(data.selectors.fields.nodeTypeSelect, key, value);
            });
        }

    };

}(Graffeine));
