/**
 *  Handle drag-start on draglet
**/

Graffeine.eventHandler.prototype.dragletDragStart = function() {
    return function(d, i) {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).attr('pointer-events', 'none');
        graph.refs.force.stop();

        var svgPos = $('svg').offset();

        // remember intial position of draglet

        var ox = d3.select(this).attr('cx');
        var oy = d3.select(this).attr('cy');

        d3.select(this)
            .attr('cx-home', ox)
            .attr('cy-home', oy);

        // position origin of connector path

        var l1x = d.x;
        var l1y = d.y + 35;

        d3.select(this)
            .attr('lx-home', l1x)
            .attr('ly-home', l1y);

        graph.state.sourceNode  = d;
        graph.state.draggedNode = this;

    };
};

/**
 *  Handle drag on draglet
**/

Graffeine.eventHandler.prototype.dragletDrag = function() {
    return function(d,i){

        // get mouse position and move draglet

        var cx = d3.mouse(this)[0];
        var cy = d3.mouse(this)[1];

        d3.select(this)
            .attr('cx', cx)
            .attr('cy', cy);

        // get origin and new end of connector line

        var originx = d3.select(this).attr('lx-home');
        var originy = d3.select(this).attr('ly-home');

        var dragletx = parseInt(d3.mouse(document.getElementById('graph'))[0], 10) - 5;
        var draglety = parseInt(d3.mouse(document.getElementById('graph'))[1], 10) - 5;

        var lineData = [ 
            { source: { x: originx,   y: originy - 40 },
              target: { x: dragletx,  y: draglety     } }
        ];

        // draw the line

        var getSource = function(d) { return d.source; };
        var getTarget = function(d) { return d.target; };

        var link = graph.refs.svg.selectAll(".connector").data(lineData);
        var line = d3.svg.diagonal();

        line.source(getSource);
        line.target(getTarget);

        link.enter()
            .append("path")
                .attr("class", "connector")
                .attr("d", line)
                .attr('pointer-events', 'none');

        link.attr("d", line);

        link.exit()
            .remove();
    };
};

/**
 *  Handle drag-end on draglet
**/

Graffeine.eventHandler.prototype.dragletDragEnd = function() { 
    var ui = Graffeine.ui;
    return function(d,i){

        // TODO - there is a better idiomatic way of doing this with D3
        // that doesn't use cx-home etc

        d3.select(this).attr( 'pointer-events', '');
        d3.select(this)
            .attr('cx', d3.select(this).attr('cx-home'))
            .attr('cy', d3.select(this).attr('cy-home'));

        if(graph.state.hoveredNode) { 
            ui.pathEdit.show(graph.state.sourceNode, graph.state.hoveredNode);
        }
        else { 
            ui.util.endDraglet();
        }
    };
};
