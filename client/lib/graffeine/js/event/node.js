
/**
 *  Handle clicks on node/circle
**/

Graffeine.eventHandler.prototype.nodeClick = function(graph) { 
    var ui = Graffeine.ui;
    return function(d, i) { 
        d3.event.stopPropagation();
        graph.refs.force.stop();
        ui.nodeInfo.hide();
        if(graph.state.selectedNode===null) { 
            graph.debugMesg("(click) set new selected node");
            graph.selectNode(d, this);
            ui.util.selectNode(this);
        }
        else {
            if(graph.state.selectedNode.elem!==this) { 
                graph.debugMesg("(click) change selected node");
                ui.util.unselectNode(graph.state.selectedNode.elem);
                graph.selectNode(d, this);
                ui.util.selectNode(this);
            }
            else { 
                graph.debugMesg("(click) remove selected node");
                ui.util.unselectNode(this);
                graph.unselectNode();
            }
        }
    };
};

/**
 *  Handle double-click on node/circle
**/

Graffeine.eventHandler.prototype.nodeDoubleClick = function(graph) {
    return function(d, i) {
        graph.debugMesg("(nodeDoubleClick) fetching new graph start from " + d.id);
        Graffeine.command.graphFetch({ start: d.id });
    };
};

/**
 *  Handle right-clicks on node
**/

Graffeine.eventHandler.prototype.nodeRightClick = function(graph) { 
    var ui = Graffeine.ui;
    return function(d, i) { 
        console.log("context: node");
        ui.util.eventBlock();
        ui.nodeInfo.hide();
        graph.refs.force.stop();
        ui.nodeContext.show(d, this);
    };
};
