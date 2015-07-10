/**
 *  Node Edit
 *
 *  Edit node JSON Modal
 *
**/

Graffeine.ui.nodeEdit = (function(G) { 

    var ui = G.ui;
    var graph = G.graph;

    var data = { 
        selectors: { 
            target:  "#node-edit-container",
            content: "#node-edit-content",
            buttons: { 
                save: "#node-edit-save",
                cancel: "#node-edit-cancel"
            },
            sections: { 
                labels: "#node-edit-labels",
                paths: "#node-edit-paths",
                properties: "#node-edit-properties",
                form: "#node-edit-form"
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

        ui.util.modal(data.selectors.content);

        ui.util.event(data.selectors.content, "show.bs.modal", function(e) { 
            var node = ui.state.nodeSelected() ? ui.state.getSelectedNode() : new G.model.Node({})
            $(data.selectors.sections.paths).html(renderPaths(node));
            $(data.selectors.sections.properties)
                .medea({ properties: node.data, labels: node.labels }, { 
                    id: "node-edit-form", 
                    buttons: false,
                    labelColumns: 2,
                    inputColumns: 8,
                    noForm: true
                }) 
                .on("medea.submit", function (e, objectData) { 
                    $(data.selectors.sections.properties).off("medea.submit");
                    console.log("submitting node edit form");
                    e.preventDefault();
                    if(objectData === undefined) {
                        console.error("no form data found")
                        console.error(arguments);
                    }
                    else {
                        createOrUpdateNode(objectData);
                    }
                });
        });

        ui.util.event(data.selectors.content, "hide.bs.modal", function(e) { 
            $(data.selectors.sections.labels).empty();
            $(data.selectors.sections.paths).empty();
            $(data.selectors.sections.properties).empty();
            ui.util.enableActionButtons();
            ui.state.unsetMenuActive();
        });

        ui.util.event(data.selectors.buttons.save, "click", function(e) { 
            e.preventDefault();
            $(data.selectors.sections.properties).trigger("submit");
            G.ui.nodeEdit.hide();
            G.ui.state.unselectNode();
        });

        function createOrUpdateNode(nodeObject) { 
            var nodeId = G.ui.state.nodeSelected ? G.ui.state.getSelectedNode().id : null;
            if(nodeId!==null) { 
                G.command.send("nodes:update", { id: nodeId, data: nodeObject });
            }
            else { 
                G.command.send("nodes:add", { data: nodeObject });
            }
        }

    };

    function addUniqueSelectOption(select, value, text) { 
        if(!$(select + " option[value='" + value + "']").length) {
             $(select).append($("<option></option>").attr("value", value).text(text));
        }
    };

    function addEvents() { 
        ui.util.event(".delete-path", "click", function(e) { 
            var dp = e.target.attributes["data-path"].value;
            console.log(JSON.parse(decodeURI(dp)));
        });
    };

    function renderPaths(node) { 
        var container = (node.paths().length===0) ? $('<span>no relationships</span>') : $('<table></table>');
        container.attr('class', 'table');
        node.paths().forEach(function(path) { 
            var row = $('<tr></tr>');
            var c1  = $('<td></td>');
            var spn = $('<span></span>')
                .addClass("path-name")
                .html(path.source.getName() + " " + path.name + " " + path.target.getName());
            c1.append(spn).appendTo(row);
            var actionTD = $('<td></td>')
                .addClass("text-right");
            var btn = $('<button/>', { 
                // click: function(e) { graph.handler.deleteLabelButtonClick(node.id, path); } 
            });
            btn.prop("type", "button");
            btn.addClass("btn btn-danger btn-xs");
            var encodedData = encodeURI(JSON.stringify({
                source: path.source.id, 
                target:path.target.id, 
                name:path.name
            }));
            var btnSpan = $('<span/></span>')
                .addClass("delete-path glyphicon glyphicon-trash")
                .attr("data-path", encodedData)
                .attr("aria-label", "delete")
                .attr("aria-hidden", "true");
            btn.append(btnSpan);
            actionTD.append(btn).appendTo(row);
            container.append(row);
        });
        return container;
    };

    function renderData(node) { 
        return G.util.objToForm(node.data);
    };

    return { 

        show: function(node) { 
            $(data.selectors.content).modal('show');
        },

        hide: function() { 
            $(data.selectors.content).modal('hide');
        },

        /**
        updateNodeTypes: function() { 
            var graph = G.graph;
            $(data.selectors.fields.nodeTypeSelect).empty();
            $.each(graph.getNodeTypes(), function(key, value) { 
                addUniqueSelectOption(data.selectors.fields.nodeTypeSelect, key, value);
            });
        }
        **/

    };

}(Graffeine));
