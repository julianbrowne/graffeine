/**
 *  Node Context
 *
 *  Basic Node Operations
 *
**/

Graffeine.ui.nodeContext = (function(G) { 

    var self = this;
    var ui = G.ui;
    var util = G.util;

    var data = { 
        selectors: { 
            target:  "#node-context-container",
            content: "#node-context-content",
            buttons: { 
                erase: "#node-delete",
                clone: "#node-clone"
            },
            fields: { 
                data: "#node-context-data",
                labels: "#node-context-labels",
                paths: "#node-context-paths"
            }
        },
        viewURL: G.config.root + "html/node-context.html"
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

        ui.util.event(data.selectors.buttons.erase, 'click', function(e) { 
            if(!ui.state.nodeSelected()) { 
                console.log("node delete called but no node on the graph selected");
                return;
            }
            var nodeId = ui.state.getSelectedNode().id;
            console.log(ui.state.getSelectedNode());
            console.log("deleting node id %s %s", nodeId, ui.state.getSelectedNode().getName());
            Graffeine.command.send('node-delete', { id: nodeId });
            ui.state.unselectNode();
            ui.nodeContext.hide();
        });

        ui.util.event(data.selectors.buttons.clone, 'click', function(e) { 
            // @todo doesn't work ??
            var newObj = ui.util.formToObject(graph.ui.identifiers.nodeEditableData.replace(/#/,''));
            Graffeine.command.send('node-add', newObj);
        });

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
        console.log(util);
        return util.objToForm(node.data);
    };

    return { 
        show: function(node, element) { 
            ui.state.selectNode(node, element);
            $(data.selectors.fields.data).html(renderData(node));
            $(data.selectors.fields.labels).html(renderLabels(node));
            $(data.selectors.fields.paths).html(renderPaths(node));
            addEvents();
            $(data.selectors.content).modal('show');
        },
        hide: function() { 
            $(data.selectors.content).modal('hide');
        }
    };

}(Graffeine));
