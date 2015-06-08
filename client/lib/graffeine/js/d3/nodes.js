
/**
 *  Add a placeholder for svg circle (node) elements
**/

Graffeine.graph.prototype.makeNodeRoot = function() {
    this.debugMesg("(makeNodeRoot) Making new svg node root");

    this.refs.circle = this.refs.svg
        .append("svg:g")
        .attr("class", "nodes")
        .selectAll("circle");

    this.refs.draglet = this.refs.svg
        .append("svg:g")
        .attr("class", "draglets")
        .selectAll("circle");

};

/**
 *  Add svg circle elements (nodes) to circle root placeholder
**/

Graffeine.graph.prototype.drawNodes = function() {

    this.debugMesg("(drawNodes) drawing " + this.refs.force.nodes().length + " nodes");

    this.refs.circle = this.refs.circle
        .data(this.refs.force.nodes(), function(node) { return node.id; });

    this.refs.circle.selectAll("circle")
        .transition()
        .attr('r', Graffeine.config.graphSettings.circleRadius + 5)
        .ease("elastic");

    this.refs.circle.enter()
        .append("svg:circle")
            .attr("id",    function(d) { return "node-" + d.id; })
            .attr("class", function(d) { return d.getClass(); })
            .attr("r", Graffeine.config.graphSettings.circleRadius)
            .on("click", this.handler.nodeClick(this))
            .on("dblclick", this.handler.nodeDoubleClick(this))
            .on("mouseover", function(d) { d.events.mouseover(this) })
            .on("mouseout",  function(d) { d.events.mouseout(this)  })
            .on("contextmenu", this.handler.nodeRightClick(this))
            .call(this.refs.force.drag);

    this.refs.circle.exit()
        .remove();

    /**
     *  Draglets
    **/

    this.refs.draglet = this.refs.draglet
        .data(this.refs.force.nodes(), function(node) { return node.id; });

    var dragCircle = d3.behavior.drag()
        .on('dragstart', this.handler.dragletDragStart(this))
        .on('drag', this.handler.dragletDrag(this))
        .on('dragend', this.handler.dragletDragEnd(this));

    this.refs.draglet.enter()
        .append("svg:circle")
            .attr("id",    function(d) { return "node-tag-" + d.id; })
            .attr("class", "draglet")
            .attr("r", 5)
            .attr("cx", 0)
            .attr("cy", 40)
            .call(dragCircle);

    this.refs.draglet.exit()
        .remove();

};
