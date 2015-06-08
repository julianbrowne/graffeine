/**
 *  Clean up and make new SVG element for graph
**/

Graffeine.graph.prototype.makeSvg = function() { 

    var graph = this;
    var ui = Graffeine.ui;

    this.debugMesg("(makeSvg) creating new SVG element");
    $(this.refs.div).empty();
    this.state.source = null;
    this.state.target = null;

    // force layout

    this.refs.force = d3.layout.force()
        .nodes(d3.values(this.data.nodes), function(node) { return node.id; })
        .links(this.data.paths, function(path) { 
            return path.source.id + "-" + path.target.id; 
        })
        .size([this.width, this.height])
        .linkDistance(this.settings.linkDistance)
        .charge(this.settings.charge)
        .on('start', function() { 
            // @todo combine these into a state change function
            $("#graph-force").text("stop");
            graph.state.forceActive = true;
        })
        .on('end', function() { 
            // @todo combine these into a state change function
            $("#graph-force").text("force");
            graph.state.forceActive = false;
        })
        .on("tick", Graffeine.force.tick(this));

    this.refs.svg = d3
        .select(this.refs.div)
        .append("svg:svg")
        .on('click', function() { 
            console.log("(svgClick) processing");
            graph.refs.force.stop();
            if(graph.state.selectedNode!==null) { 
                ui.util.unselectNode(graph.state.selectedNode.elem);
                graph.unselectNode();
                ui.nodeContext.hide();
                ui.graphStats.hide();
            }
        })
        .attr("width",  this.width)
        .attr("height", this.height);

    /**
     *  svg definitions area
    **/

    Graffeine.graph.defs = this.refs.svg.append('svg:defs');

    /**
     *  arrow head
    **/

    Graffeine.graph.defs
        .append("svg:marker")
            .attr("id", "arrowhead")
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("viewBox", "0 0 10 10")
            .attr("markerUnits", "strokeWidth")
            .attr("stroke", "#d35400")
            .attr("stroke-width", "2")
            .attr("fill", "#d35400")
            .attr("refX", 5)
            .attr("refY", 5)
            .attr("orient", "auto")
            .on("mouseover", function() { console.log("marker hover"); })
        .append("svg:polygon")
            .attr("points", "0,0 10,5 0,10")
            .attr("class", "arrowhead");

    /**
     *  drop shadow
    **/

    var filter = Graffeine.graph.defs
        .append("svg:filter")
            .attr("id", "dropshadow")
            .attr("height", "130%");

    filter.append("svg:feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", "3");

    filter.append("svg:feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", "3");

    filter.append("svg:feOffset")
        .attr("dx", "2")
        .attr("dy", "2")
        .attr("result", "offsetblur")

    var feMerge = filter.append("svg:feMerge")

    feMerge.append("svg:feMergeNode");
    feMerge.append("svg:feMergeNode")
        .attr("in", "SourceGraphic");

    //  make root placeholders for paths (lines), circles (nodes),
    //  and text (labels)

    this.makePathRoot();
    this.makePathIconRoot();
    this.makeNodeRoot();
    this.makeLabelsRoot();

};
