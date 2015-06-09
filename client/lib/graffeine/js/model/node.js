/**
 *  Graffeine Node object
 *
 *  @constructor
 *  @this {node}
 *  @param {graffnode} graffnode a graffnode data obj from the server
 *  @return {node} New node object
 *
**/

Graffeine.model = (typeof Graffeine.model==="undefined") ? {} : Graffeine.model;

Graffeine.model.Node = function(graffnode) { 

    var node = this;
    var ui = Graffeine.ui;
    var graffnode = (graffnode) ? graffnode : { data: {} };

    this.data = graffnode.data;
    this.labels = graffnode.labels ? graffnode.labels : [];
    Object.keys(graffnode).forEach(function(key){ node[key] = graffnode[key]; });
    this.isEdgeNode = false;

    this.getName = function() { 
        if(Graffeine.util.getType(this.name)==='array')
            return this.name.join(' ');
        else
            return this.name;
    };

    this.addLabels = function(labelsArray) { 
        this.labels = labelsArray;
    };

    this.getIcon = function() { 
        if(this.type === undefined)
            return "?";
        if(Graffeine.conf && Graffeine.conf.nodeIconFor) {

            if(Graffeine.conf.nodeIconFor[this.type])
                return Graffeine.conf.nodeIconFor[this.type];

            if(Graffeine.conf.nodeIconFor['default'])
                return Graffeine.conf.nodeIconFor['default'];

        }
        return "-";
    };

    this.getType = function() {
        return this.type;
    };

    this.getClass = function() { 
        var css = "node";
        if(this.isEdgeNode) css += " edge";
        css += " " + this.cssClass;
        return css;
    };

    this.paths = function() { 
        return Graffeine.graph.paths().filter(function(p) { 
            return (p.source.id === node.id || p.target.id === node.id)
        });
    };

    /**
     * transfer over d3 force fields to smooth updates
    **/

    this.transferD3Data = function(oldNode) {
        fields = [ 'x', 'y', 'px', 'py', 'weight', 'index']
        var node = this;
        fields.forEach(function(field) {
            node[field] = oldNode[field];
        });
    };

    this.events = { 

        mouseover: function(node, element) { 

            var r = d3.select(element).attr('r');

            d3.select(element)
                .transition()
                .attr('r', Graffeine.config.graphSettings.circleRadius + 5)
                .ease("elastic");

            if(ui.state.sourceNodeSelected()) { 
                ui.state.hoverNode(node, element);
            }

            if(ui.state.draggedNode === null)
                ui.nodeInfo.show(node);
        },

        mouseout: function(node, element) { 

            d3.select(element)
                .transition()
                .attr('r', Graffeine.config.graphSettings.circleRadius)
                .ease("elastic");

            d3.select(element)
                .classed('joiner', false);

            /**
             *  Remove this node from the hoveredNode state
             *  if the ui is in the middle of a drag
            **/

            if(ui.state.sourceNodeSelected()) ui.state.unhoverNode();

            ui.nodeInfo.hide();
        }
 
    };

};
