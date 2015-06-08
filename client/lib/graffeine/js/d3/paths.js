
/**
 *  Add a placeholder for svg path elements
**/

Graffeine.graph.prototype.makePathRoot = function() {
    this.debugMesg("(makePathRoot) Making new svg path root");
    this.refs.path = this.refs.svg
        .append("svg:g")
        .attr("class", "paths")
        .selectAll("path");
};

/**
 *  Add svg path elements to path root placeholder
**/

Graffeine.graph.prototype.drawPaths = function() {

    this.debugMesg("(drawPaths) drawing " + this.refs.force.links().length + " paths");

    this.refs.path = this.refs.path
        .data(this.refs.force.links(), function(link) { return link.source.id + "-" + link.target.id; });

    this.refs.path.enter()
        .append("svg:path")
            .attr("class", function(d) { return "link " + d.name; })
            .attr("marker-mid", "url(#arrowhead)")
            .on("mouseover",   this.handler.linkMouseover(this))
            .on("mouseout",    this.handler.linkMouseout(this))
            .on("contextmenu", this.handler.linkRightClick(this));

    this.refs.path.exit()
        .remove();

};
