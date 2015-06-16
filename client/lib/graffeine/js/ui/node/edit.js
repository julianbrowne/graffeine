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
                data: "#node-edit-data",
                labels: "#node-edit-labels",
                paths: "#node-edit-paths"
            },
            fields: { 
                form: "#node-edit-body",
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

        ui.util.modal(data.selectors.content);

        ui.util.event(data.selectors.content, "show.bs.modal", function(e) { 

            var node = ui.state.getSelectedNode();

            $(data.selectors.sections.data).html(renderData(node));
            $(data.selectors.sections.labels).html(renderLabels(node));
            $(data.selectors.sections.paths).html(renderPaths(node));

            /**

            addEvents();

            if(!node) node = new Graffeine.model.Node();
            $(data.selectors.fields.form).html(
                Graffeine.util.objToForm(node.data, { type: { 
                    data: graph.getNodeTypes(), 
                    user: true, selected: node.type 
                }})
            );
            ui.util.disableActionButtons();

            **/
        });

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

    function addEvents() { 
        ui.util.event(".delete-path", "click", function(e) { 
            var dp = e.target.attributes["data-path"].value;
            console.log(JSON.parse(decodeURI(dp)));
        });
    };

    function renderLabels(node) { 
        var container = (node.labels.length===0) ? $("<span>no labels</span>") : $("<table></table>");
        container.attr("class", "table");
        node.labels.forEach(function(label) { 
            var row = $("<tr></tr>");
            var c1  = $("<td></td>");
            var spn = $("<span></span>")
                .addClass("node-menu-label-name");
            var input = $("<input>")
                .addClass("col-sm-8")
                .attr("type", "text")
                .attr("name", label)
                .attr("value", label);
            spn.append(input);
            c1.append(spn).appendTo(row);
            var actionTD = $('<td></td>')
                .addClass("text-right");
            var btn = $('<button/>', { 
                // click: function(e) { graph.handler.deleteLabelButtonClick(node.id, label); } 
            });
            btn.prop("type", "button");
            btn.addClass("btn btn-danger btn-xs");
            var btnSpan = $('<span/></span>')
                .addClass("glyphicon glyphicon-trash")
                .attr("aria-label", "delete")
                .attr("aria-hidden", "true");
            btn.append(btnSpan);
            actionTD.append(btn).appendTo(row);
            container.append(row);
        });
        return container;
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
            ui.util.enableActionButtons();
            ui.state.setMenuActive();
        },

        updateNodeTypes: function() { 
            var graph = G.graph;
            $(data.selectors.fields.nodeTypeSelect).empty();
            $.each(graph.getNodeTypes(), function(key, value) { 
                addUniqueSelectOption(data.selectors.fields.nodeTypeSelect, key, value);
            });
        }

    };

}(Graffeine));
