
Graffeine.graph.prototype.makePathIconRoot = function() {

    this.debugMesg("(makePathIconsRoot) Making new path-icons root");

    this.refs.pathIcon = this.refs.svg
        .append("svg:g")
        .attr("class", "path-icons")
        .selectAll("g");

};

Graffeine.graph.prototype.drawPathIcons = function() {

    this.debugMesg("(drawPathIcons) drawing path-icons");

    this.refs.pathIcon = this.refs.pathIcon
        .data(this.refs.force.links());

};
