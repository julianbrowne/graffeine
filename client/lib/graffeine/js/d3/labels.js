
/**
 *  Add a placeholder for svg text (node lable) elements
**/

Graffeine.graph.prototype.makeLabelsRoot = function() {

    this.debugMesg("(makeLabelsRoot) Making new svg labels root");

    this.refs.text = this.refs.svg
        .append("svg:g")
        .attr("class", "node-labels")
        .selectAll("g");

    this.refs.icon = this.refs.svg
        .append("svg:g")
        .attr("class", "node-icons")
        .selectAll("g");
};

/**
 *  Add svg text elements (labels) to svg:g/g root placeholder
 *  
 *  Note: actually adds two sets of text elements, one based
 *  on the node's name and one based on the node's type.
 *
**/

Graffeine.graph.prototype.drawLabels = function() {

    this.debugMesg("(drawLabels) drawing labels");

    this.refs.text = this.refs.text
        .data(this.refs.force.nodes(), function(node) { return node.id; });

    this.refs.text.selectAll("text")
        .text(function(node) { return "-- | --"; });

    this.refs.text.enter()
        .append("svg:text")
            .attr("class", "node-label")
            .attr("text-anchor", "middle")
            //.style('fill',  function(d) { return  d.label.fill; })
            .attr("x", 0)
            .attr("y", 5)
            .attr('pointer-events', 'none')
            .text(function(node) { return node.getName(); });

    this.refs.text.exit()
        .remove();

    this.refs.icon = this.refs.icon
        .data(this.refs.force.nodes(), function(node) { return node.id; });

    this.refs.icon.enter()
        .append("svg:foreignObject")
            .attr("width", 20)
            .attr("height", 20)
            .attr("y", "-25px")
            .attr("x", "-7px")
        .append("xhtml:span")
            .attr("class", "control glyphicon glyphicon-record");

/**
        .append("svg:text")
            .attr("class", function(d) { return "node-icon " + d.getType(); })
            //.attr("class", "glyphicon glyphicon-record")
            //.attr("aria-hidden", "true")
            //.attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", 20)
            .attr('pointer-events', 'none')
            .text(function(node) { return "&#xe165;"; });
**/

    this.refs.icon.exit()
        .remove();

};
