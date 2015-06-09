/**
 *  Graph State
 *
 *  Basic state manager
 *
**/

Graffeine = (typeof Graffeine==="undefined") ? {} : Graffeine;
Graffeine.ui = (typeof Graffeine.ui==="undefined") ? {} : Graffeine.ui;

Graffeine.ui.state = (function() { 
    return new function() { 

        this.selectedNode = null;
        this.selectedSourceNode = null;
        this.selectedTargetNode = null;
        this.hoveredNode = null;
        this.draggedNode = null;

        this.dragNode = function(node) { 
            this.draggedNode = node;
            return node;
        };

        this.undragNode = function() { 
            this.draggedNode = null;
        };

        this.getDraggedNode = function() { 
            return this.draggedNode;
        };

        this.nodeDragged = function() { 
         return (this.draggedNode===null) ? false : true;
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
            this.selectedNode={ node: node, element: element };
            if(element) d3.select(element).classed("selected", true);
        };

        this.unselectNode = function() { 
            if(this.selectedNode) { 
                var element = this.selectedNode.element;
                if(element) d3.select(element).classed("selected", false);
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

    };
}());
