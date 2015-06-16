
Graffeine.svg = (function(G) { 

    var ui = G.ui;
    var graph = G.graph;
    var config = G.config;

    var svg = null;
    var force = null;
    var defs = null;

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

    function makeLabelsRoot() { 
        data.labels.text = svg.append("svg:g").attr("class", "node-labels").selectAll("g");
        data.labels.icon = svg.append("svg:g").attr("class", "node-icons").selectAll("g");
    };

    function drawLabels() { 

        data.labels.text = data.labels.text.data(force.nodes(), function(n) { return n.id; });

        data.labels.text.selectAll("text").text(function(n) { return "-- | --"; });

        data.labels.text.enter()
            .append("svg:text")
                .attr("id", function(d) { return "node-label-" + d.id; })
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
                .attr("id", function(d) { return "node-icon-" + d.id; })
                .attr("width", 20)
                .attr("height", 20)
                .attr("y", "-25px")
                .attr("x", "-7px")
            .append("xhtml:span")
                .attr("class", function(d) { 
                    return "control glyphicon " + d.getIconName();
                });

        data.labels.icon.exit()
            .remove();
    };

    function makeNodeRoot() { 
        data.circle = svg.append("svg:g").attr("class", "nodes").selectAll("circle");
        data.draglet = svg.append("svg:g").attr("class", "draglets").selectAll("circle");
    };

    function drawNodes() { 

        var ui = G.ui;
        var util = G.util;

        data.circle = data.circle.data(force.nodes(), function(n) { return n.id; });

        data.circle.selectAll("circle")
            .transition()
            .attr('r', config.node.radius + 5)
            .ease("elastic");

        /**
         *  Node drag manager
        **/

        var nodeDragger = force.drag()
            .on("dragstart", function(d) { 
                // ignore right-click
                if(d3.event.sourceEvent.button===2) return;
                console.log("node: dragstart");
                d3.event.sourceEvent.stopPropagation();
                ui.nodeInfo.hide();
                ui.state.dragNode(d, this);
            })
            .on("dragend", function(d) { 
                // ignore right-click
                if(d3.event.sourceEvent.button===2) return;
                console.log("node: dragend");
                // check for no drag (i.e. click)
                var originalPosition = ui.state.getDraggedOrigin();
                if(originalPosition.x!==d.x&&originalPosition.y!==d.y) { 
                    console.log("node: dragend: fixing node position");
                    d3.select(this).classed("fixed", d.fixed = true);
                }
                else {
                    console.log("node: dragend: ignored (click)");
                }
                ui.state.undragNode();
            });

        /**
         *  Bring on the nodes
        **/

        data.circle.enter()
            .append("svg:circle")
                .attr("id",    function(d) { return "node-" + d.id; })
                .attr("class", function(d) { 
                    var css = "node";
                    if(d.isEdgeNode) css += " edge";
                    css += " " + ui.util.suggestLabelCSS(d);
                    return css;
                })
                .attr("r", config.node.radius)
                .on("mousedown", function(d,i) { 
                    G.ui.nodeInfo.hide(); 
                })
                .on("click", function(d, i) { 
                    if (d3.event.defaultPrevented) return;
                    d3.event.stopPropagation();
                    console.log("node: click");
                    var ui = G.ui;
                    if(ui.state.menuActive()) { 
                        console.log("node: click: aborted (menu active)");
                        return;
                    }
                    forceStop();
                    // node node currently selected
                    if(!ui.state.nodeSelected()) { 
                        console.log("node: click: selecting node %d", d.id);
                        ui.state.selectNode(d, this);
                    }
                    else { 
                        // node selected but not this one
                        if(ui.state.getSelectedElement()!==this) { 
                            console.log("node: click: switching nodes");
                            ui.state.unselectNode();
                            ui.state.selectNode(d, this);
                        }
                        // node selected is this one,
                        // so unselect it
                        else { 
                            console.log("node: click: toggling node");
                            ui.state.unselectNode();
                        }
                    }
                })
                .on("dblclick", function(d) { 
                    console.log("node: double-click");
                    var ui = G.ui;
                    if(ui.state.menuActive()) { 
                        console.log("node: double-click: aborted (menu active)");
                        return;
                    }
                    d3.select(this).classed("fixed", d.fixed = false);
                    //G.command.graphFetch({ start: d.id });
                })
                .on("mouseover", function(d) { 
                    console.log("node: mouseover");
                    var ui = G.ui;
                    d3.select(this)
                        .transition()
                        .attr('r', G.config.node.radius + 5)
                        .ease("elastic");

                        if(ui.state.sourceNodeSelected())
                            ui.state.hoverNode(d, this);

                        if(!ui.state.nodeDragged())
                            ui.nodeInfo.show(d);
                })
                .on("mouseout", function(d) { 
                    console.log("node: mouseout");
                    var ui = G.ui;
                    d3.select(this)
                        .transition()
                        .attr('r', G.config.node.radius)
                        .ease("elastic");
                    d3.select(this)
                        .classed('joiner', false);
                    /**
                     *  Remove this node from the hoveredNode state
                     *  if the ui is in the middle of a drag
                    **/
                    if(ui.state.sourceNodeSelected()) ui.state.unhoverNode();
                    ui.nodeInfo.hide();
                })
                .on("contextmenu", function(d) { 
                    console.log("node: right-click");
                    var ui = G.ui;
                    if(ui.state.menuActive()) { 
                        console.log("node: right-click: aborted (menu active)");
                        return;
                    }
                    ui.state.selectNode(d, this);
                    ui.nodeMenu.show(d, this);
                })
                .call(nodeDragger);

        data.circle.exit()
            .remove();

        data.draglet = data.draglet
            .data(force.nodes(), function(n) { return n.id; });

        var dragletDragger = d3.behavior.drag()
            .on('dragstart', dragletStart)
            .on('drag', dragletDrag)
            .on('dragend', dragletStop);

        data.draglet.enter()
            .append("svg:circle")
                .attr("id", function(d) { return "draglet-" + d.id; })
                .attr("class", "draglet")
                .attr("r", 5)
                .attr("cx", 0)
                .attr("cy", G.config.graphSettings.dragletOffset)
                .call(dragletDragger);

        data.draglet.exit()
            .remove();

    };

    function dragletStart(d, i) { 

        var ui = G.ui;

        d3.select(this).attr('pointer-events', 'none');
        forceStop();

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

        var ui = G.ui;

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

        var cx = d3.mouse(this)[0];
        var cy = d3.mouse(this)[1];

        d3.select(this).attr('cx', cx).attr('cy', cy);

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
        var ui = G.ui;
        var nodeCount = G.util.objectLength(graph.nodes());
        console.log("svg: refreshing the display with %s nodes", nodeCount);
        force
            .nodes(d3.values(graph.nodes()), function(n) { return n.id; })
            .links(graph.paths(), function(p) { return p.source.id + "-" + p.target.id; });
        drawPaths();
        drawPathIcons();
        drawNodes();
        drawLabels();
        ui.state.nodesOnDeck(nodeCount);
        ui.graphStats.refresh();
        forceStart();
    };

    function init() { 

        console.log("svg: init()");

        var graph = G.graph;
        var ui = G.ui;

        $(config.graphTargetDiv).empty();
        ui.state.selectSourceNode(null);
        ui.state.selectTargetNode(null);

        force = d3.layout.force();
//            .nodes(d3.values(graph.nodes()), function(n) { return n.id; })
//            .links(graph.paths(), function(p) { return p.source.id + "-" + p.target.id; })
        force.size([config.graphSettings.width, config.graphSettings.height])
        force.linkDistance(config.graphSettings.linkDistance)
        force.charge(config.graphSettings.charge)
        force.on('start', function() { if(!G.ui.state.forceActive()) G.ui.state.setForceActive(); })
        force.on('end', function() { if(G.ui.state.forceActive()) G.ui.state.unsetForceActive(); })
        force.on("tick", forceTick);

        svg = d3
            .select(G.config.graphTargetDiv)
            .append("svg:svg")
            .on('click', function() { 
                console.log("svg: click");
                forceStop();
                if(ui.state.nodeSelected()) ui.state.unselectNode();
            })
            .on('contextmenu', function() { 
                // don't open browser right-click menu
                d3.event.preventDefault();
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

    function forceStart(d) { 
        if(G.ui.state.forceActive()||force===null) return;
        force.start();
        G.ui.state.setForceActive();
    };

    function forceStop(d) { 
        if(!G.ui.state.forceActive()||force===null) return;
        force.stop();
        G.ui.state.unsetForceActive();
    };

    function forceTick(d) { 

        var graph = G.graph;
        var ui = G.ui;
        var r = G.config.node.radius;
        var height = G.config.graphSettings.height;
        var width = G.config.graphSettings.width;

        if(!ui.state.forceActive()) return;

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
        init: init,
        refresh: refresh,
        endDraglet: endDraglet,
        forceStart: forceStart,
        forceStop: forceStop
    };

}(Graffeine));
