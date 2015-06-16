/**
 *  Node Menu
 *
 *  Node Operations Menu
 *  (view, edit, delete, etc)
 *
**/

Graffeine.ui.nodeMenu = (function(G) { 

    var self = this;
    var ui = G.ui;
    var util = G.util;

    var data = { 
        selectors: { 
            target:  "#node-menu-container",
            content: "#node-menu-content",
            customModal: "#custom-modal",
            actions: { 
                view: "#init-node-view",
                edit: "#init-node-edit",
                remove: "#init-node-delete",
                clone: "#init-node-clone",
                inspect: "#init-node-inspect"
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

        ui.util.modal(data.selectors.content);

        ui.util.event(data.selectors.actions.remove, 'click', function(e) { 
            if(!ui.state.nodeSelected()) { 
                console.log("node delete called but no node on the graph selected");
                return;
            }
            var nodeId = ui.state.getSelectedNode().id;
            Graffeine.command.send('node-delete', { id: nodeId });
            ui.state.unselectNode();
            ui.nodeMenu.hide();
        });

        ui.util.event(data.selectors.actions.clone, 'click', function(e) { 
            // @todo
            // var newObj = ui.util.formToObject(graph.ui.identifiers.nodeEditableData.replace(/#/,''));
            // Graffeine.command.send('node-add', newObj);
        });

        /** View node data **/

        ui.util.event(data.selectors.actions.view, 'click', function(e) { 
            ui.nodeMenu.hide();
            ui.nodeView.show();
        });

        /** Edit node data **/

        ui.util.event(data.selectors.actions.edit, 'click', function(e) { 
            ui.nodeMenu.hide();
            ui.nodeEdit.show();
        });

        /** Inspect node data **/

        ui.util.event(data.selectors.actions.inspect, 'click', function(e) { 
            ui.nodeMenu.hide();
            var customModal = $('<div id="custom-modal" class="modal" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title">Modal</h4> </div> <div id="custom-modal-body" class="modal-body"> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">OK</button> </div> </div> </div> </div>');
            $("body").append(customModal);
            $(data.selectors.customModal).find($('h4')).html("Node Inspect");
            ui.util.modal(data.selectors.customModal);
            $(data.selectors.customModal).on('show.bs.modal', function() { 
                var code = $("<pre><code>")
                    .html(JSON.stringify(ui.state.getSelectedNode(),null,2));
                $("#custom-modal-body").html(code);
                $("#custom-modal-body.modal-body pre").each(function(i, block) { 
                    hljs.highlightBlock(block);
                  });
            });
            $(data.selectors.customModal).modal("show");
            $(data.selectors.customModal).on('hidden.bs.modal', function() { 
                $(data.selectors.customModal).remove();
            });
        });

    };

    return { 
        show: function(node, element) { 
            $(data.selectors.content).modal('show');
        },
        hide: function() { 
            $(data.selectors.content).modal('hide');
        }
    };

}(Graffeine));
