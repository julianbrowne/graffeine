
Graffeine.svg = (function(G) { 

    var ui = G.ui;
    var graph = G.graph;
    var config = G.config;

    var svg = null;
    var force = null;
    var defs = null;

    var forceActive = false;

    var data = { 
        labels: {
            text: null,
            icon: null,
        },
        circle: null,
        draglet: null,
        path: null,
        pathIcon: null,
        definitions: null
    };

    var state = { 
        selectedNode: null,    // ref to currently selected/highlighted node
        sourceNode: null,      // ref to origin node of draglet drag
        draggedNode: null,     // ref to currently dragged draglet node
        newPathActive: false,  // ref to flag showing whether new relationship dialog is up
        hoveredNode: null      // ref to currently hovered over node during a drag
    };

    function makeLabelsRoot() { 
        data.labels.text = svg.append("svg:g").attr("class", "node-labels").selectAll("g");
        data.labels.icon = svg.append("svg:g").attr("class", "node-icons").selectAll("g");
    };

    function drawLabels() { 

        data.labels.text = data.labels.text.data(force.nodes(), function(n) { return n.id; });

        data.labels.text.selectAll("text").text(function(n) { return "-- | --"; });

        data.labels.text.enter()
            .append("svg:text")
                .attr("class", "node-label")
                .attr("text-anchor", "middle")
                .attr("x", 0)
                .attr("y", 5)
                .attr('pointer-events', 'none')
                .text(function(n) { return n.getName(); });

        data.labels.text.exit()
            .remove();

        data.labels.icon = data.labels.icon.data(force.nodes(), function(n) { return n.id; });

        data.labels.icon.enter()
            .append("svg:foreignObject")
                .attr("width", 20)
                .attr("height", 20)
                .attr("y", "-25px")
                .attr("x", "-7px")
            .append("xhtml:span")
                .attr("class", "control glyphicon glyphicon-record");

        data.labels.icon.exit()
            .remove();
    };

    function makeNodeRoot() { 
        data.circle = svg.append("svg:g").attr("class", "nodes").selectAll("circle");
        data.draglet = svg.append("svg:g").attr("class", "draglets").selectAll("circle");
    };

    function drawNodes() { 

        data.circle = data.circle.data(force.nodes(), function(n) { return n.id; });

        data.circle.selectAll("circle")
            .transition()
            .attr('r', config.graphSettings.circleRadius + 5)
            .ease("elastic");

        data.circle.enter()
            .append("svg:circle")
                .attr("id",    function(d) { return "node-" + d.id; })
                .attr("class", function(d) { return d.getClass(); })
                .attr("r", config.graphSettings.circleRadius)
                .on("click", nodeClick)
                .on("dblclick", nodeDoubleClick)
                .on("mouseover", function(d) { d.events.mouseover(d, this) })
                .on("mouseout",  function(d) { d.events.mouseout(d, this) })
                .on("contextmenu", nodeRightClick)
                .call(force.drag);

        data.circle.exit()
            .remove();

        data.draglet = data.draglet
            .data(force.nodes(), function(n) { return n.id; });

        var dragCircle = d3.behavior.drag()
            .on('dragstart', dragletStart)
            .on('drag', dragletDrag)
            .on('dragend', dragletStop);

        data.draglet.enter()
            .append("svg:circle")
                .attr("id",    function(d) { return "node-tag-" + d.id; })
                .attr("class", "draglet")
                .attr("r", 5)
                .attr("cx", 0)
                .attr("cy", 40)
                .call(dragCircle);

        data.draglet.exit()
            .remove();

    };

    function dragletStart(d, i) { 
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).attr('pointer-events', 'none');
        force.stop();

        var svgPos = $('svg').offset();

        // remember intial position of draglet

        var ox = d3.select(this).attr('cx');
        var oy = d3.select(this).attr('cy');

        d3.select(this)
            .attr('data-cx-home', ox)
            .attr('data-cy-home', oy);

        // position origin of connector path

        var l1x = d.x;
        var l1y = d.y + 35;

        d3.select(this)
            .attr('lx-home', l1x)
            .attr('ly-home', l1y);

        ui.state.selectSourceNode(d);
        ui.state.dragNode(this);
    };

    function dragletStop (d, i) { 

        d3.select(this).attr("pointer-events", "");
        d3.select(this)
            .attr('cx', d3.select(this).attr('data-cx-home'))
            .attr('cy', d3.select(this).attr('data-cy-home'));

        if(ui.state.nodeHovered()) { 
            var source = ui.state.getSelectedSourceNode();
            var target = ui.state.getHoveredNode();
             ui.pathEdit.show(source, target);
        }
        else { 
            endDraglet();
        }
    };

    function endDraglet() { 
        var ui = G.ui;
        ui.state.unselectSourceNode();
        ui.state.unhoverNode();
        ui.state.undragNode();
        d3.selectAll(".connector").remove();
    };

    function dragletDrag(d, i) { 

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

        var link = svg.selectAll(".connector").data(lineData);
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

    function nodeClick(d, i) { 
        d3.event.stopPropagation();
        force.stop();
        ui.nodeInfo.hide();
        // node node currently selected
        if(!ui.state.nodeSelected()) { 
            ui.state.selectNode(d, this);
        }
        else { 
            // node selected but not this one
            if(ui.state.getSelectedElement()!==this) { 
                ui.state.unselectNode();
                ui.state.selectNode(d, this);
            }
            // node selected is this one,
            // so unselect it
            else { 
                ui.state.unselectNode();
            }
        }
    };

    function nodeDoubleClick(d, i) { 
        Graffeine.command.graphFetch({ start: d.id });
    };

    function nodeRightClick(d, i) { 
        console.log("context: node");
        ui.util.eventBlock();
        ui.nodeInfo.hide();
        force.stop();
        ui.nodeContext.show(d, this);
    };

    function makePathIconRoot() { 
        data.pathIcon = svg.append("svg:g").attr("class", "path-icons").selectAll("g");
    };

    function drawPathIcons() { 
        data.pathIcon = data.pathIcon.data(force.links());
    };

    function makePathRoot() { 
        data.path = svg.append("svg:g").attr("class", "paths").selectAll("path");
    };

    function drawPaths() { 
        data.path = data.path
            .data(force.links(), function(path) { return path.source.id + "-" + path.target.id; });

        data.path.enter()
            .append("svg:path")
                .attr("class", function(d) { return "link " + d.name; })
                .attr("marker-mid", "url(#arrowhead)")
                .on("mouseover", function(d, i) {})
                .on("mouseout", function(d, i) {})
                .on("contextmenu", function(d, i) {});

        data.path.exit()
            .remove();
    };

    function refresh() { 
        var graph = G.graph;
        force
            .nodes(d3.values(graph.nodes()), function(n) { return n.id; })
            .links(graph.paths(), function(p) { return p.source.id + "-" + p.target.id; });
        drawPaths();
        drawPathIcons();
        drawNodes();
        drawLabels();
        force.start();
    };

    function makeSVG() { 

        var graph = G.graph;
        var ui = G.ui;

        $(config.graphTargetDiv).empty();
        ui.state.selectSourceNode(null);
        ui.state.selectTargetNode(null);

        force = d3.layout.force()
            .nodes(d3.values(graph.nodes()), function(n) { return n.id; })
            .links(graph.paths(), function(p) { return p.source.id + "-" + p.target.id; })
            .size([config.graphSettings.width, config.graphSettings.height])
            .linkDistance(config.graphSettings.linkDistance)
            .charge(config.graphSettings.charge)
            .on('start', function() { 
                // @todo combine these into a state change function
                $("#graph-force").text("stop");
                forceActive = true;
            })
            .on('end', function() { 
                // @todo combine these into a state change function
                $("#graph-force").text("force");
                forceActive = false;
            })
            .on("tick", forceTick);

        svg = d3
            .select(G.config.graphTargetDiv)
            .append("svg:svg")
            .on('click', function() { 
                force.stop();
                if(ui.state.nodeSelected()) ui.state.unselectNode();
            })
            .attr("width",  config.graphSettings.width)
            .attr("height", config.graphSettings.height);

        data.definitions = svg.append('svg:defs');

        data.definitions
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

        var filter = data.definitions
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

        makePathRoot();
        makePathIconRoot();
        makeNodeRoot();
        makeLabelsRoot();

    };

    function forceStart() { 
        if(forceActive) return;
        force.start();
    };

    function forceStop() { 
        if(!forceActive) return;
        force.stop();
    };

    function forceTick() { 

        var graph = G.graph;
        var r = G.config.graphSettings.circleRadius;
        var height = G.config.graphSettings.height;
        var width = G.config.graphSettings.width;

        if(!forceActive) return;

        data.path
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

        data.circle
            .attr("cx", function(d) {
                return d.x = Math.max(r, Math.min(width - r, d.x)); 
            })
            .attr("cy", function(d) {
                return d.y = Math.max(r, Math.min(height - r, d.y)); 
            });

        data.pathIcon
            .attr("transform", function(d) {
                return "translate(" +((d.target.x+d.source.x)/2) + "," +
                    ((d.target.y+d.source.y))/2 + ")";
            });

        data.draglet
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        data.labels.text
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        data.labels.icon
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    };

    return { 
        init: makeSVG,
        refresh: refresh,
        endDraglet: endDraglet,
        forceStart: forceStart,
        forceStop: forceStop
    };

}(Graffeine));
