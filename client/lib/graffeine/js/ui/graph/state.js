/**
 *  Graph State
 *
 *  Basic state manager
 *
**/

Graffeine.ui.state = (function(G) { 
    return new function() { 

        this.data = {};
        this.selectedNode = null;

        this.set = function(key, value) { 
            this.data[key] = value;
        };

        this.get = function(key) { 
            return this.data[key];
        };

        this.selectNode = function(node, element) { 
            this.selectedNode={ data: node, elem: element };
        };

        this.unselectNode = function() { 
            this.selectedNode=null;
        };

        this.nodeSelected = function() { 
            return (this.selectedNode===null) ? false : true;
        };

        this.getSelectedNode = function() { 
            if(this.selectedNode===null) return null;
            return this.selectedNode.data;
        };

        this.getSelectedElement = function() { 
            if(this.selectedNode===null) return null;
            return this.selectedNode.elem;
        };

    };
}(Graffeine));
