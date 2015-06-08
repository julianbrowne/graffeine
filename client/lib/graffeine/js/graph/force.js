/**
 *  Graph tick event closure
 *
 *  @param {graph} graph object
 *  @returns {function} tick handler
**/

Graffeine.force = {};

Graffeine.force.tick = function(graph) { 

    var r = graph.settings.circleRadius;

    return function() { 

        if(!graph.state.forceActive) return;

        graph.refs.path
            .attr("d", function(d) {

                if(d.source.x === undefined || d.source.x === null) {
                    console.log("(force.tick) d.source - data error :");
                    console.log(d.source);
                    throw "tick data error";
                }
                if(d.target.x === undefined || d.target.x === null) {
                    console.log("(force.tick) d.target - data error :");
                    console.log(d.target);
                    throw "tick data error";
                }
                var dx = d.target.x - d.source.x;
                var dy = d.target.y - d.source.y;

                if(d.source.x === d.target.x && d.source.y === d.target.y) {
                    //var dr = Math.sqrt(dx * dx + dy * dy);
                    //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 1,1 " + d.target.x + "," + d.target.y;
                    return "M" + d.source.x + "," + d.source.y + "A40,40 40 1,1 " + (d.target.x + 1) + "," + (d.target.y + 1);
                }
                else {
                    var midx = d.source.x + ((d.target.x - d.source.x) / 2.3);
                    var midy = d.source.y + ((d.target.y - d.source.y) / 2.3);

                    return "M" + d.source.x + "," + d.source.y + 
                           "L" + midx + "," + midy +
                           "L" + d.target.x + "," + d.target.y;
                }

            });

        graph.refs.circle
            .attr("cx", function(d) {
                return d.x = Math.max(r, Math.min(graph.width - r, d.x)); 
            })
            .attr("cy", function(d) {
                return d.y = Math.max(r, Math.min(graph.height - r, d.y)); 
            });

        graph.refs.pathIcon
            .attr("transform", function(d) {
                return "translate(" +((d.target.x+d.source.x)/2) + "," +
                    ((d.target.y+d.source.y))/2 + ")";
            });

        graph.refs.draglet
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        graph.refs.text
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        graph.refs.icon
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

    };
};
