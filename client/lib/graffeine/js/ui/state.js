/**
 *  Graph State
 *
 *  Basic state manager
 *
**/

Graffeine = (typeof Graffeine==="undefined") ? {} : Graffeine;
Graffeine.ui = (typeof Graffeine.ui==="undefined") ? {} : Graffeine.ui;

Graffeine.ui.state = (function(G) { 
    return new function() { 

        this.selectedNode = null;
        this.selectedSourceNode = null;
        this.selectedTargetNode = null;
        this.hoveredNode = null;
        this.draggedNode = null;
        this.countOfNodesOnDeck = 0;
        this.menuActivated = false;
        this.forceActivated = false;
        this.dbConnected = false;

        this.dragNode = function(node, element) { 
            var nodeClone = $.extend({}, node);
            this.draggedNode = {node: node, element: element, x: nodeClone.x, y: nodeClone.y };
            d3.select(element).classed("moving", true);
            return node;
        };

        this.undragNode = function() { 
            if(this.draggedNode===null) return;
            d3.select(this.draggedNode.element).classed("moving", false);
            this.draggedNode = null;
        };

        this.getDraggedOrigin = function() { 
            if(this.draggedNode===null) return null;
            return { x: this.draggedNode.x, y: this.draggedNode.y };
        };

        this.getDraggedNode = function() { 
            if(this.draggedNode===null) return null;
            return this.draggedNode.node;
        };

        this.nodeDragged = function() { 
         return (this.draggedNode===null) ? false : true;
        };

        this.nodeDragged = function() { 
         return (this.draggedNode===null) ? false : true;
        };

        this.connectDB = function() { 
            this.dbConnected = true;
            $(".db-indicator")
                .removeClass("label-default")
                .addClass("label-success");
        };

        this.connected = function() { 
            return this.dbConnected;
        };

        this.disconnectDB = function() { 
            this.dbConnected = false;
            $(".db-indicator")
                .removeClass("label-success")
                .addClass("label-default");
        };

        this.nodesOnDeck = function(count) { 
            if(count===undefined) return this.countOfNodesOnDeck;
            this.countOfNodesOnDeck = count;
            if(count>0) { 
                $(".disable-when-graph-empty").removeClass("disabled");
                $(".disable-when-nodes-on-deck").addClass("disabled");
            }
            else {
                $(".disable-when-graph-empty").addClass("disabled");
                $(".disable-when-nodes-on-deck").removeClass("disabled");
            }
            return this.countOfNodesOnDeck;
        };

        this.hoverNode = function(node, element) { 
            this.hoveredNode = { node: node, element: element };
            d3.select(element).classed('joiner', true);
            return element;
        };

        this.unhoverNode = function() { 
            if(this.hoveredNode) { 
                var element = this.hoveredNode.element;
                d3.select(element).classed('joiner', false);
                this.hoveredNode = null;
            }
        };

        this.getHoveredNode = function() { 
            if(this.hoveredNode)
                return this.hoveredNode.node;
            return null;
        };

        this.getHoveredElement = function() { 
            if(this.hoveredNode)
                return this.hoveredNode.element;
            return null;
        };

        this.nodeHovered = function() { 
            return (this.hoveredNode===null) ? false : true;
        };

        this.selectNode = function(node, element) { 
            this.unselectNode();
            this.selectedNode={ node: node, element: element };
            console.log("selectNode: selected node %s", this.selectedNode.node.id);
            d3.select(element).classed("selected", true);
        };

        this.unselectNode = function() { 
            if(this.selectedNode!==null) { 
                console.log("unselectNode: unselected node %s", this.selectedNode.node.id);
                d3.select(this.selectedNode.element).classed("selected", false);
                this.selectedNode = null;
            }
        };

        this.nodeSelected = function() { 
            return (this.selectedNode===null) ? false : true;
        };

        this.getSelectedNode = function() { 
            if(this.selectedNode===null) return null;
            return this.selectedNode.node;
        };

        this.getSelectedElement = function() { 
            if(this.selectedNode===null) return null;
            return this.selectedNode.element;
        };

        this.selectSourceNode = function(node) { 
            this.selectedSourceNode = node;
            return node;
        };

        this.selectTargetNode = function(node) { 
            this.selectedTargetNode = node;
            return node;
        };

        this.unselectSourceNode = function() { 
            this.selectedSourceNode=null;
        };

        this.unselectTargetNode = function() { 
            this.selectedTargetNode=null;
        };

        this.getSelectedSourceNode = function() { 
            return this.selectedSourceNode;
        };

        this.getSelectedTargetNode = function() { 
            return this.selectedTargetNode;
        };

        this.sourceNodeSelected = function() { 
            return (this.selectedSourceNode===null) ? false : true;
        };

        this.targetNodeSelected = function() { 
            return (this.selectedTargetNode===null) ? false : true;
        };

        this.setMenuActive = function() { 
            console.log("setMenuActive: setting");
            G.svg.forceStop();
            this.menuActivated = true;
        };

        this.unsetMenuActive = function() { 
            console.log("unsetMenuActive: unsetting");
            this.menuActivated = false;
        };

        this.menuActive = function() { 
            return this.menuActivated;
        };

        this.setForceActive = function() { 
            this.forceActivated = true;
            console.log("force: active");
            G.ui.util.forceButton("on");
        };

        this.unsetForceActive = function() { 
            this.forceActivated = false;
            console.log("force: inactive");
            G.ui.util.forceButton("off");
        };

        this.forceActive = function() { 
            return this.forceActivated;
        };

    };
}(Graffeine));
