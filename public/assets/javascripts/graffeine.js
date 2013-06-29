/**
 *  Graph command manager 
**/

Graffeine = Graffeine || {};

Graffeine.command = function(graph) {

    /**
     *  Send a command (instruction) to the db
     *
     *  @param {string} command the command tag to send
     *  @param {object} data the data associated with the command
    **/

    this.send = function(command, data) {
        graph.socket.emit(command, data);
    };

    /**
     *  Receive a command (data update) from the db
     *
     *  @param {string} command the command tag received
     *  @param {function} callback the function associated with processing the command
     *  @param {boolean} [visUpdate=false] request update of db stats (for mutable ops)
    **/

    this.recv = function(command, callback, visUpdate) {
        graph.socket.on(command, function(data) {
            if(visUpdate) graph.socket.emit('graph-stats', {});
            callback(data);
        });
        graph.debugMesg("(command.recv) registered receiver for > " + command);
    };

    this.init = function() {

        // initialise combined node/link data

        this.recv('data-nodes', function (data) {
            graph.debugMesg("(data-nodes) processing");
            var newVis = ($('#graph-mode').text() === "replace") ? 'replace' : 'update';
            graph.updateMode = newVis;
            graph.addGraphData(data);
            graph.refresh();
            $('#graph-root').text(data.root||0);
        });

        // add new node

        this.recv('node-new', function (data) {
            graph.debugMesg("(node-new) processing");
            graph.addNode(data.node);
            graph.refresh();
        }, true);

        // join nodes

        this.recv('node-join', function (data) {
            graph.addLink(data.source, data.target, data.rel);
            graph.refresh();
        }, true);

        // stats - node count

        this.recv('nodes-count', function (data) {
            graph.debugMesg("(nodes-count) processing");
            graph.ui.updateNeoData('nodesCount', data.count);
        });

        // stats - rels count

        this.recv('rels-count', function (data) {
            graph.debugMesg("(rels-count) processing");
            graph.ui.updateNeoData('relsCount', data.count);
        });

        // delete existing node

        this.recv('node-delete', function (data) {
            graph.debugMesg("(node-delete) processing");
            graph.removeNode(data.id);
            graph.ui.clearNodeMenuData();
            graph.refresh();
        }, true);

        // update existing node

        this.recv('node-update', function (node) {
            graph.debugMesg("(node-update) processing");
            graph.addNode(node.data);
            graph.resetLinks();
            graph.refresh();
        }, false);

        // delete existing rel

        this.recv('rel-delete', function (data) {
            graph.debugMesg("(rel-delete) processing");
            graph.removeLink(data.source, data.target, data.rel);
            graph.refresh();
        }, true);

    };
};
/**
 *  Graph tick event closure
 *
 *  @param {graph} graph object
 *  @returns {function} tick handler
**/

Graffeine = Graffeine || {};

Graffeine.force = {};

Graffeine.force.tick = function(graph) {

    return function() {

        var r = graph.settings.circleRadius;

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
};/**
 *  Central Graffeine Graph object
 *
 *  @constructor
 *  @this {graph}
 *  @param {string} [divRoot='body'] html selector to attach svg to. Defaults to doc body
 *  @return {graph} New graph object
 *
**/

var Graffeine = Graffeine || {};

Graffeine.graph = function(config) {

    this.data = {
        nodeTypes:    [],       // types of node/entity known to the graph
        linkTypes:    [],       // types of relationship/link known to the graph
        nodes:        {},       // nodes in the graph
        links:        [],       // links between nodes in the graph
        dbStats:      {},       // useful stats about the db
        neoNodes:      0        // nodes in the master neo4J db
    };

    this.refs = {
        div:      null,         // ref to div to hold svg
        svg:      null,         // ref to root svg element
        force:    null,         // ref to d3 force calc
        defs:     null,         // ref to svg defs section
        path:     null,         // ref to svg path (rel/link) elems
        pathIcon: null,         // ref to image that sits on (rel/link) elem
        circle:   null,         // ref to svg circle (node) elems
        draglet:  null,         // ref to svg circle (draglet) elems
        text:     null,         // ref to svg text (node label) elems
        icon:     null,         // ref to svg text (node icon) elems
        tooltip:  null,         // ref to tooltip for paths/rels
        linkMenu: null,         // TODO: investigate use then maybe delete?
    };

    this.state = {
        selectedNode: null,     // ref to currently selected/highlighted node
        sourceNode:   null,     // ref to origin node of draglet drag
        draggedNode:  null,     // ref to currently dragged draglet node
        newRelDialog: false,    // ref to flag showing whether new relationship dialog is up
        hoveredNode:  null      // ref to currently hovered over node during a drag
    };

    // wire in socket, command, ui and event handlers

    this.socket      = new io.connect(Graffeine.conf.core.host);
    this.command     = new Graffeine.command(this);
    this.ui          = new Graffeine.ui(this);
    this.handler     = new Graffeine.eventHandler(this);

    this.settings    = Graffeine.conf.graphSettings;
    this.debug       = false;
    this.refs.div    = this.ui.identifiers.graphPlaceholder;
    this.updateMode  = 'replace';           // {'update'|'replace'} for new svg data

    this.width       = Graffeine.conf.graphSettings.width;
    this.height      = Graffeine.conf.graphSettings.height;

    this.nodeCount = function() {
        var size = 0;
        for (var key in this.data.nodes) {
            if (this.data.nodes.hasOwnProperty(key)) size++;
        }
        return size;
    };

    this.debugMesg = function(mesg) {
        if(this.debug)
            console.log("DEBUG : " + mesg);
    };


};

/**
 *  Refresh the graph layout
 *  (e.g. after adding new nodes or relationships)
**/

Graffeine.graph.prototype.refresh  = function() {

    this.debugMesg("(refresh) refreshing graph");
    this.ui.updateNodeTypes();
    this.ui.updateStats(this);

    if(this.updateMode === 'replace' || $(this.refs.div).length === 0) {
        this.makeSvg();
    }

    this.checkLinks();

    this.refs.force
        .nodes(d3.values(this.data.nodes), function(node) { return node.id; })
        .links(this.data.links, function(link) { return link.source.id + "-" + link.target.id; });

    this.drawPaths();
    this.drawPathIcons();
    this.drawNodes();
    this.drawLabels();

    this.refs.force
        .start();

};

/**
 *  Shorthand function to add multiple nodes and links to the graph
 *
 *  @param {array} graphData array of standardised nodes and link objects
 *  extracted from neo4J
 *  @param {boolean} create if set to true (default) creates data structures
 *  otherwise (if set to false) will graph data to existing structures.
**/

Graffeine.graph.prototype.addGraphData = function(graphData) {

    this.debugMesg("(addGraphData) --------");
    this.debugMesg("(addGraphData) update mode is " + this.updateMode);

    var graph = this;

    if(this.updateMode === 'replace') {
        this.data.nodes     = {};
        this.data.links     = [];
    }

    graph.data.neoNodes = graphData.count;

    //  Add all nodes *then* all links
    //  Innefficient, but ensures links are only between 'known' nodes

    graphData.nodes.forEach(function(n) {
        if(n.node === 'n') graph.addNode(n);
    });

    graphData.nodes.forEach(function(n) {
        if(n.node === 'r') graph.addLink(n.start, n.end, n.type);
    });

    this.debugMesg("(addGraphData) There are " + d3.values(this.data.nodes).length + " nodes in the graph");
    this.debugMesg("(addGraphData) There are " + this.data.links.length + " links in the graph");

    this.ui.disableGraphActionButtons(false);

};

/**
 *  Add node to the graph
 *
 *  @param {node} node data struct
**/

Graffeine.graph.prototype.addNode = function(node) {

    if(this.nodeCount() > Graffeine.conf.graphSettings.nodeLimit) {
        console.log("WARNING: Node count exceeds max (" + 
            Graffeine.conf.graphSettings.nodeLimit + ")" + 
            "set by Graffeine.conf.graphSettings - ignoring");
        return;
    }

    if(node.id === undefined) {
        console.log("ERROR: Could not add node " + JSON.stringify(node) + " no id field defined");
        return;
    }

    this.debugMesg("(addNode) Adding node " + node.id);
    var n = new Graffeine.Node(node);
    if(this.data.nodes[n.id] !== undefined) n.transferD3Data(this.data.nodes[n.id]);
    this.data.nodes[n.id] = n;
    this.addNodeType(n.type);
};

/**
 *  Resets all links (paths) to the node instance referred to
**/

Graffeine.graph.prototype.resetLinks = function() {
    var graph = this;
    this.data.links.forEach(function(link){
        link.source = graph.data.nodes[link.source.id];
        link.target = graph.data.nodes[link.target.id];
    });
};

/**
 *  Remove a node from the graph
 *
 *  @param {integer} id id of node
**/

Graffeine.graph.prototype.removeNode  = function(id) {
    this.debugMesg("(removeNode) omiting node with id " + id);
    delete this.data.nodes[id];
};

/**
 *  Connect two nodes on the graph
 *
 *  @param {integer} sourceIndex id of the start node
 *  @param {integer} targetIndex id of the end node
 *  @param {string} relType name of this relationship
 *  @todo serious clean up needed here, plus this should probably take link obj as arg
**/

Graffeine.graph.prototype.addLink = function(sourceIndex, targetIndex, relType) {

    if(sourceIndex === undefined || sourceIndex === null) {
        console.log("ERROR: (addLink) - missing source");
        return;
    }

    if(targetIndex === undefined || targetIndex === null) {
        console.log("ERROR: (addLink) - missing target");
        return;
    }

    if(relType === undefined || relType === null) {
        console.log("ERROR: (addLink) - missing relationship");
        return;
    }

    // Only link nodes that are known to exist

    if(this.data.nodes[sourceIndex] === undefined && this.data.nodes[targetIndex] === undefined)
        return;

    if(this.data.nodes[sourceIndex] !== undefined && this.data.nodes[targetIndex] !== undefined) {
        var source = this.data.nodes[sourceIndex];
        var target = this.data.nodes[targetIndex];
        var link = new Graffeine.Link(source, target, relType);
    }

    //  Where there's a source, but no target, or a target, but no source
    //  add a 'page' indicator

    if(this.data.nodes[sourceIndex] !== undefined && this.data.nodes[targetIndex] === undefined) {
        this.data.nodes[sourceIndex].visEdge = true;
        return;
    }

    if(this.data.nodes[sourceIndex] === undefined && this.data.nodes[targetIndex] !== undefined) {
        this.data.nodes[targetIndex].visEdge = true;
        return;
    }

    // if this link already exists update it

    if(this.linkExists(sourceIndex, targetIndex, relType)) {
        this.debugMesg("(addLink) Updating existing link from " + link.source.id + " to " + link.target.id + " of type " + link.rel);
        this.removeLink(sourceIndex, targetIndex, relType);
        var source = this.data.nodes[sourceIndex];
        var target = this.data.nodes[targetIndex];
        var link = new Graffeine.Link(source, target, relType);
    }

    this.data.links.push(link);
    this.addLinkType(link.rel);

};

/**
 *  Remove a link from the graph
 *
 *  @param {integer} source id of node at start of link
 *  @param {integer} target id of node at end of link
 *  @param {string}  rel    name of link type
**/

Graffeine.graph.prototype.removeLink  = function(source, target, rel) {
    this.data.links = _.reject(this.data.links, function(link){
        return (link.source.id === source && link.target.id === target && link.rel === rel);
    });
};

/**
 *  Check if a link exists in the graph between nodes
 *
 *  @param {integer} source id of node at start of link
 *  @param {integer} target id of node at end of link
 *  @param {string}  rel    name of link type
 *  @todo make rel optional so that any link can be determined
**/

Graffeine.graph.prototype.linkExists  = function(source, target, rel) {
    var match = _.find(this.data.links, function(link){
        return (link.source.id === source && link.target.id === target && link.rel === rel);
    });
    return (match !== undefined);
};

/**
 *  Make sure all links (paths) have existent nodes
**/

Graffeine.graph.prototype.checkLinks = function() {
    var nodes = this.data.nodes;
    this.data.links = _.reject(this.data.links, function(link){
        return (nodes[link.source.id]===undefined || nodes[link.target.id]===undefined)
    });
};

/**
 *  Add a new type of node (e.g. 'person') to known the graph node types
 *
 *  @param {string} nodeType string defining the type of node
**/

Graffeine.graph.prototype.addNodeType = function(nodeType) {

    this.data.nodeTypes.push(nodeType);
    this.data.nodeTypes = this.data.nodeTypes.sort().filter(function(el,i,a) {
        if(i===a.indexOf(el)) return 1;
        return 0;
    });

};

/**
 *  Add a new type of link (e.g. 'knows') to graph link types
 *
 *  @param {string} linkType string defining the type of link
**/

Graffeine.graph.prototype.addLinkType = function(linkType) {

    this.data.linkTypes.push(linkType);
    this.data.linkTypes = this.data.linkTypes.sort().filter(function(el,i,a) {
        if(i===a.indexOf(el)) return 1;
        return 0;
    });

};

Graffeine.graph.prototype.selectNode = function(node, element) {
    this.state.selectedNode={ data: node, elem: element };
};

Graffeine.graph.prototype.unselectNode = function() {
    this.state.selectedNode=null;
};

/**
 *  Join two nodes on the graph
 *
 *  {Graffeine.Node} source origin node for this connection
 *  {Graffeine.Node} target destination node for this connection
 *  {string} rel name of this relationship type
**/

Graffeine.graph.prototype.connectNodes = function(source, target, rel) {

    if(source === undefined || source === null || source.id === undefined || source.id === null) {
        console.log("ERROR: Cannot join source node with no ID");
        return;
    }

    if(target === undefined || target === null || target.id === undefined || target.id === null) {
        console.log("ERROR: Cannot join target node with no ID");
        return;
    }

    this.command.send('node-join', { source: source.id, target: target.id, rel: rel });

};
/**
 *  Graffeine Link object
 *
 *  @constructor
 *  @this {link}
 *  @param {node} source origin node for this link
 *  @param {node} target destination node for this link
 *  @param {string} rel relationship type of this link
 *  @return {link} New link object
 *
**/

Graffeine.Link = function(source, target, rel) {
    this.source = source;
    this.target = target;
    this.rel = rel;
};
/**
 *  Graffeine Node object
 *
 *  @constructor
 *  @this {node}
 *  @param {graffnode} graffnode a graffnode data obj from the server
 *  @return {node} New node object
 *
**/

Graffeine.Node = function(graffnode) {

    var node = this;

    this.data = graffnode.data;

    Object.keys(graffnode).forEach(function(key){
        node[key] = graffnode[key];
    });

    this.visEdge = false;

    this.getName = function() {
        return this.name;
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
        var klass = "node";
        if(this.visEdge) klass += " edge";
        klass += " " + this.getType();
        return klass;
    };

    this.getRels = function(graph) {
        var node = this;
        return _(graph.data.links).filter(function(link) {
            return (link.source.id === node.id || link.target.id === node.id)
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

};
/**
 *  Graffeine utility functions
**/

Graffeine.util = {}

/**
 *  Takes obj and returns HTML form
 *
 *  @param {object} data node.data object
**/

Graffeine.util.objectToForm = function(data, opts) {
    var str = "";
    Object.keys(data).forEach(function(key){
        str += '<div>';
        str += '<label class="form-label">' + key + '</label>';
        if(opts[key] === undefined)
          str += Graffeine.util.jsToFormField(data[key], key, "", 14);
        else
          str += Graffeine.util.jsToFormField(opts[key].data, key, null, null, opts[key].selected, opts[key].user);
        str += '</div>';
    });
    return str;
};

Graffeine.util.relsArrayToHTML = function(nodeId, rels) {

    if(rels.length === 0)
        return '<div class="info"><span class="rel-icon"></span> no relationships</div>';

    var str = '';
    str += '<div>';
    rels.forEach(function(rel){
        str += '<div class="info">';
        if(rel.source.id === nodeId)
            str += '<span class="rel-icon"></span>';
        else
            str += "<span class='rel-icon'></span>";
        str += ' ' + rel.source.getName();
        str += ' ' + rel.rel;
        str += ' ' + rel.target.getName();
        str += '</div>';
    });
    str += '</div>';
    return str;
};

Graffeine.util.relsTypesArrayToHTML = function(rels) {

    if(rels.length === 0)
        return '<div class="info">no relationships</div>';

    var str = '';
    str += '<div>';
    rels.forEach(function(rel){
        str += '<div>' + rel + '</div>';
    });
    str += '</div>';
    return str;
};

Graffeine.util.paramDefault = function(param, def) {
  if(param === undefined || param === null || param === '')
    return def;
  else
    return param;
};

/**
 *  Convert js object to an html form field
 *
 *  @param {object} jsObj the js object to base the form field on
 *  @param {string} [name=""] the name of the form field
 *  @param {string} [id=""] the html id attribute for this field
 *  @param {integer} [sixe=50] the size (chars) for this field
 *  @param {string} [sel=null] the value of the selected item if jsObj is an array
 *  @todo big stinky de-odourising refactor required
**/

Graffeine.util.jsToFormField = function(jsObj, name, id, size, sel, user) {

  var type  = Graffeine.util.getType(jsObj);
  var id    = Graffeine.util.paramDefault(id,      '');
  var size  = Graffeine.util.paramDefault(size,    50);
  var name  = Graffeine.util.paramDefault(name,    '');
  var sel   = Graffeine.util.paramDefault(sel,   null);
  var user  = Graffeine.util.paramDefault(user, false);
  
  switch(type) {
    case "string" :
      return '<input type="text" jsontype="' + type + '" name="' + name + '" id="' + id + '" size="' + size + '" value="' + jsObj +'" />';
      break;
    
    case "number" :
      return '<input type="text" jsontype="' + type + '" name="' + name + '" id="' + id + '" size="' + size + '" value="' + jsObj +'" />';
      break;
      
    case "array" :
      var str = '<select name="' + name + '" jsontype="' + type + '" id="' + id + '">';
      jsObj.forEach(function(opt){
        if(sel !== null && sel === opt)
          str += '<option selected value="' + opt + '">' + opt + '</option>';
        else
          str += '<option value="' + opt + '">' + opt + '</option>';
      });
      str += '</select>';
      if(user)
      str += 'or <input type="text" jsontype="string" value="" size="10" name="' + name + '"/>';
      return str;
      break;

    case "boolean" :
      if(jsObj === true)
        return '<input type="checkbox" jsontype="' + type + '" name="' + name + '" id="' + id + '" checked />';
      else
        return '<input type="checkbox" jsontype="' + type + '" name="' + name + '" id="' + id + '" />';
      break;
  }
  console.log("ERROR : (jsToFormField) : no element found for type of " + type);
  return "<div>form error</div>";
};

/**
 *  More precise version of typeof
 *
 *  @param {object} obj object to inspect
**/

Graffeine.util.getType = function(obj) {
  var s = typeof obj;

  if (s === 'object') {
    if (obj) {
      if (typeof obj.length === 'number' && !(obj.propertyIsEnumerable('length')) && typeof obj.splice === 'function') {
        s = 'array';
      }
    }
    else
      s = 'null';
  }
  return s;
};

/**
 *  Takes HTML form and converts to js obj. Adapted from original by Maxim Vasiliev
 *
 *  @param {element|string} root root form element (or it's id)
 *  @param {string} [delim='.'] form sub-parts delimiter
**/

Graffeine.util.formToObject = function(root, delim) {

    var rootNode = (typeof root === 'string') ? document.getElementById(root) : root;
    var delimiter = (delim === undefined) ? '.' : delim;
    var formValues = Graffeine.util.getFormValues(rootNode);
    var result = {};
    var arrays = {};
            
    for(var i=0; i<formValues.length; i++) {

        var value = formValues[i].value;
        if (value === '') continue;

        var name = formValues[i].name;
        var nameParts = name.split(delimiter);

        var currResult = result;

        for (var j=0; j<nameParts.length; j++) {
 
            var namePart = nameParts[j];
            var arrName;

            if (namePart.indexOf('[]') > -1 && j == nameParts.length - 1) {
                arrName = namePart.substr(0, namePart.indexOf('['));
                if (!currResult[arrName]) currResult[arrName] = [];
                currResult[arrName].push(value);
            }
            else {
                if (namePart.indexOf('[') > -1) {
                    arrName = namePart.substr(0, namePart.indexOf('['));
                    var arrIdx = namePart.replace(/^[a-z]+\[|\]$/gi, '');
                    if (!arrays[arrName]) arrays[arrName] = {};
                    if (!currResult[arrName]) currResult[arrName] = [];
                    if (j == nameParts.length - 1) {
                          currResult[arrName].push(value);
                    }
                    else {
                        if (!arrays[arrName][arrIdx]) {
                            currResult[arrName].push({});
                            arrays[arrName][arrIdx] = currResult[arrName][currResult[arrName].length - 1];
                        }
                    }
                    currResult = arrays[arrName][arrIdx];
                }
                else {
                    if (j < nameParts.length - 1) {
                        if (!currResult[namePart]) currResult[namePart] = {};
                        currResult = currResult[namePart];
                    }
                    else {
                        currResult[namePart] = value;
                    }
                }
            }
        }
    }

    return result;
};

Graffeine.util.getFormValues = function(rootNode) {
    var result = [];
    var currentNode = rootNode.firstChild;

    while (currentNode) {
          if (currentNode.nodeName.match(/INPUT|SELECT|TEXTAREA/i)) {
                result.push({ name: currentNode.name, value: Graffeine.util.getFieldValue(currentNode) });
          }
          else {
                var subresult = Graffeine.util.getFormValues(currentNode);
                result = result.concat(subresult);
          }

          currentNode = currentNode.nextSibling;
    }

    return result;
};

Graffeine.util.getFieldValue = function(fieldNode) {
    if (fieldNode.nodeName == 'INPUT') {
          if (fieldNode.type.toLowerCase() == 'radio' || fieldNode.type.toLowerCase() == 'checkbox') {
                return fieldNode.checked;
          }
          else
          {
                if (!fieldNode.type.toLowerCase().match(/button|reset|submit|image/i)) {
                      switch(Graffeine.util.getFieldType(fieldNode)) {
                            case 'string':
                                  return fieldNode.value;
                                  break;
                            case 'number':
                                  return parseInt(fieldNode.value);
                                  break;
                            case 'array':
                                  return [];
                                  break;
                            default:
                                  return fieldNode.value;
                      }
                }
          }
    }
    else {
          if (fieldNode.nodeName == 'TEXTAREA') {
                return fieldNode.innerHTML;
          }
          else {
                if (fieldNode.nodeName == 'SELECT') {
                      return Graffeine.util.getSelectedOptionValue (fieldNode);
                }
          }
    }

    return '';
};

Graffeine.util.getFieldType = function(fieldNode) {
  return fieldNode.attributes.getNamedItem('jsontype').value;
};

Graffeine.util.getSelectedOptionValue = function(selectNode) {
    var multiple = selectNode.multiple;
    if (!multiple) return selectNode.value;

    var result = [];
    for (var options = selectNode.getElementsByTagName("option"), i = 0, l = options.length; i < l; i++) {
          if (options[i].selected) result.push(options[i].value);
    }

    return result;
};
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
 *  Add svg text elements (labels) to svg:g/g root placeholder. Note, actually
 *  adds two sets of text elements, one based on the node's name and one
 *  based on the node's type.
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
            .style('fill',  function(d) { return d.label.fill; })
            .attr("x", 0)
            .attr("y", 5)
            .attr('pointer-events', 'none')
            .text(function(node) { return node.getName(); });

    this.refs.text.exit()
        .remove();

    this.debugMesg("(drawLabels) drawing icons");

    this.refs.icon = this.refs.icon
        .data(this.refs.force.nodes(), function(node) { return node.id; });

    this.refs.icon.enter()
        .append("svg:text")
            .attr("class", function(d) { return "node-icon " + d.getType(); })
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", 20)
            .attr('pointer-events', 'none')
            .text(function(node) { return node.icon; });

    this.refs.icon.exit()
        .remove();

};/**
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
        .attr('r', Graffeine.conf.graphSettings.circleRadius + 5)
        .ease("elastic");

    this.refs.circle.enter()
        .append("svg:circle")
            .attr("id",    function(d) { return "node-" + d.id; })
            .attr("class", function(d) { return d.getClass(); })
            .style('fill',  function(d) { return d.style.fill; })
            .style('stroke-width', function(d) { return d.style.strokeWidth; })
            .style('stroke', function(d) { return d.style.stroke; })
            .style('filter', 'url(#dropshadow)')
            .attr("r", Graffeine.conf.graphSettings.circleRadius)
            .on("click", this.handler.nodeClick(this))
            .on("dblclick", this.handler.nodeDoubleClick(this))
            .on("mouseover", this.handler.nodeMouseover(this))
            .on("mouseout", this.handler.nodeMouseout(this))
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
/**
 *  Make path icons route
**/

Graffeine.graph.prototype.makePathIconRoot = function() {

    this.debugMesg("(makePathIconsRoot) Making new path-icons root");

    this.refs.pathIcon = this.refs.svg
        .append("svg:g")
        .attr("class", "path-icons")
        .selectAll("g");

};

/**
 *  Draw path icons
**/

Graffeine.graph.prototype.drawPathIcons = function() {

    this.debugMesg("(drawPathIcons) drawing path-icons");

    this.refs.pathIcon = this.refs.pathIcon
        .data(this.refs.force.links());

};/**
 *  Add a placeholder for svg path elements
**/

Graffeine.graph.prototype.makePathRoot = function() {
    this.debugMesg("(makePathRoot) Making new svg path root");
    this.refs.path = this.refs.svg
        .append("svg:g")
        .attr("class", "links")
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
            .attr("class", function(d) { return "link " + d.rel; })
            .attr("marker-mid", "url(#arrowhead)")
            .on("mouseover",   this.handler.linkMouseover(this))
            .on("mouseout",    this.handler.linkMouseout(this))
            .on("contextmenu", this.handler.linkRightClick(this));

    this.refs.path.exit()
        .remove();

};
/**
 *  Clean up and make new SVG element for graph
**/

Graffeine.graph.prototype.makeSvg = function() {

    this.debugMesg("(makeSvg) creating new SVG element");
    $(this.refs.div).empty();
    this.state.source = null;
    this.state.target = null;

    // force layout

    this.refs.force = d3.layout.force()
        .nodes(d3.values(this.data.nodes), function(node) { return node.id; })
        .links(this.data.links, function(link) { return link.source.id + "-" + link.target.id; })
        .size([this.width, this.height])
        .linkDistance(this.settings.linkDistance)
        .charge(this.settings.charge)
        .on("tick", Graffeine.force.tick(this));

    this.refs.svg = d3
        .select(this.refs.div)
        .append("svg:svg")
        .on('click', this.handler.svgClick(this))
        .attr("width",  this.width)
        .attr("height", this.height);

    //  tool tip place holder

    Graffeine.graph.tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //  menu place holder for links/relations

    Graffeine.graph.linkMenu = d3.select("body").append("div")
        .attr("class", "linkMenu")
        .style("opacity", 0);

    // mouse-out event for links/relations menu

    Graffeine.graph.linkMenu
        .on("mouseout", function(d) {
            Graffeine.graph.linkMenu.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // svg definitions area

    Graffeine.graph.defs = this.refs.svg.append('svg:defs');

    // definition for arrow head

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
/**
 *  UI functions
 *
 *  All browser/jquery/dom interactions
**/

Graffeine = Graffeine || {}

Graffeine.ui = function(graph) {
    this.graph = graph;
    if(graph.debug){
        tests = [ this.identifiers, this.buttons, this.labels ];
        tests.forEach(function(selectorSet){
            Object.keys(selectorSet).forEach(function(id){
                if($(selectorSet[id]).length === 0)
                    console.log("WARNING: " + selectorSet[id] + " selector not found");
            });
        });
    };
}
/**
 *  UI JQuery dialogs for node relationship menu, join menu etc
 *
 *  @todo move all "#blahblah" tag definitions to tags.js
**/

Graffeine.ui.prototype.dialogs = function() {

    //  Dialog menu for adding new relationships between nodes

    $(this.identifiers.relDialog).dialog({
        autoOpen: false,
        height: 400,
        width: 600,
        modal: true,
        open: function() {
            $(graph.ui.identifiers.relDialog).keypress(function(e) {
                if (e.keyCode == $.ui.keyCode.ENTER) {
                    //console.log('enter');
                    //$(this).parent().find("button:eq(0)").trigger("click");
                }
            });
        },
        buttons: {
            add: function() {
                var userEntered  = $("#new-relationship-dialog-name").val();
                var menuSelected = $("#new-relationship-dialog-options").val();
                var newRelType   = (userEntered === "") ? menuSelected : userEntered;
                graph.handler.newRelSelected(newRelType);
                graph.ui.clearDrag();
                $(this).dialog("close");
            },
            close: function() {
                graph.ui.clearDrag();
                $(this).dialog("close");
            }
        },
        close: function() { graph.ui.clearDrag(); }
    });

    //  Dialog menu showing relationships for selected node.
    //  Opened on right-click. Allows deletion etc.

    $(this.identifiers.nodeMenu).dialog({
        autoOpen: false,
        height: 400,
        width: 600,
        modal: true,
        open: function() {
            $(graph.ui.identifiers.nodeMenu).keypress(function(e) {
                if (e.keyCode == $.ui.keyCode.ENTER) {
                    //console.log('enter');
                    //$(this).parent().find("button:eq(0)").trigger("click");
                }
            });
        },
        buttons: {
            close: function() {
                $(this).dialog("close");
            }
        }
    });

};
/**
 *  Set up button click event handlers
**/

Graffeine.ui.prototype.init = function() {

    $(this.identifiers.nodeEditableData).html("");
    this.disableActionButtons(true);
    this.disableGraphActionButtons(true);
    this.hideDialogs();
    this.hideNodeInformation();
    this.dialogs();
    this.registerButtonClicks();
    graph.command.send('graph-stats', {});

};


/**
 *  Update the select drop-downs on main menu with known node types to enable
 *  finding and adding new ones
**/

Graffeine.ui.prototype.updateNodeTypes = function() {
    var ui = this;
    $(ui.labels.nodeAddNewTypes).empty();
    $(ui.labels.nodeFindTypes).empty();
    $.each(graph.data.nodeTypes, function(key, value) {
        ui.addUniqueSelectOption(ui.labels.nodeAddNewTypes, key, value);
        ui.addUniqueSelectOption(ui.labels.nodeFindTypes, key, value);
    });
};

Graffeine.ui.prototype.addUniqueSelectOption = function(select, value, text) {
    if(!$(select + " option[value='" + value + "']").length) {
         $(select).append($("<option></option>").attr("value", value).text(text));
    }
};

/**
 *  Update UI stats list with useful graph metrics
**/

Graffeine.ui.prototype.updateStats = function() {
    $('#graph-node-count').html(Object.keys(graph.data.nodes).length);      // nodes in the current data payload
    $('#graph-node-max').html(graph.settings.nodeLimit);                    // max nodes allowed on screen
    $('#graph-link-count').html(graph.data.links.length);                   // links in the current data payload
    $('#graph-rel-types-count').html(graph.data.linkTypes.length);          // distinct relationship types
};

/**
 *  Update UI with global Neo4J stats
**/

Graffeine.ui.prototype.updateNeoData = function(stat, value) {
    if(this.labels[stat] === undefined) return;
    $(this.labels[stat]).html(value);
}

/**
 *  Start force/tick cycle
**/

Graffeine.ui.prototype.forceStart = function() {
    graph.refs.force.start();
}

/**
 *  Stop force/tick cycle
**/

Graffeine.ui.prototype.forceStop = function() {
    graph.refs.force.stop();
}

/**
 *  Update UI Node Edit Form with info about currently selected node
**/

Graffeine.ui.prototype.showNodeEditForm = function(node) {
    graph.debugMesg("(showNodeEditForm) showing form for node " + node.id);
    $(this.identifiers.nodeEditableData).html(Graffeine.util.objectToForm(node.data, { type: { data: graph.data.nodeTypes, user: true, selected: node.type }}));
    this.disableActionButtons(false);
};

/**
 *  Update console/menu metrics with selected node information
**/

Graffeine.ui.prototype.updateWithConsoleNodeId = function(node) {
    var update = (node === undefined) ? '-' : node.id;
    $(this.labels.nodeSelectedId).html(update);
    $(this.labels.graphStartNodeId).val(update);
    var rels = (node === undefined) ? '-' : node.getRels(graph).length;
    $(this.labels.nodeSelectedRels).html(rels);
};

/**
 *  Clear the UI Node Edit Form when, e.g. node is unselected
**/

Graffeine.ui.prototype.clearNodeMenuData = function() {
    $('#graph-start').val(0);
    $(this.identifiers.nodeEditableData).html("");
    this.disableActionButtons(true);
};

/**
 *  Update UI mouseover/mouseout floaty div with relationship info about selected node
 *
 *  @param {d3node} node the associated data node in d3
**/

Graffeine.ui.prototype.showNodeInformation = function(node) {
    graph.debugMesg("(showNodeInformation) for node   " + node.id);
    graph.debugMesg("(showNodeInformation) rels found " + node.getRels(graph).length);
    var rels = Graffeine.util.relsArrayToHTML(node.id, node.getRels(graph));
    $(this.identifiers.nodeInfoRels).html(rels);
    var left  = node.x + (Graffeine.conf.graphSettings.circleRadius * 2) - 5;
    var right = node.y + 40;
    graph.debugMesg("(showNodeInformation) pos left  " + left);
    graph.debugMesg("(showNodeInformation) pos right " + right);
    graph.debugMesg("(showNodeInformation) target    " + d3.select(this.identifiers.nodeInfo));
    d3.select(this.identifiers.nodeInfo).style("left", left  + "px");
    d3.select(this.identifiers.nodeInfo).style("top",  right + "px");
    d3.select(this.identifiers.nodeInfo).transition().delay(800).duration(600).style("opacity", .9);
};

Graffeine.ui.prototype.hideNodeInformation = function() {
    $(this.identifiers.nodeInfoRels).html("");
    d3.select(this.identifiers.nodeInfo).transition().duration(0).style("opacity", 0);
};

// todo - refactor this html making crud ..

Graffeine.ui.prototype.showNodeMenu = function(node) {
    var rels = node.getRels(graph);
    var ui = this;
    var table  = $('<table></table>');
    rels.forEach(function(rel){
        var row = $('<tr></tr>');
        var c1  = $('<td></td>');
        var spn = $('<span></span>', {
            text: rel.source.getName() + ' -> ' + rel.rel + ' -> ' + rel.target.getName(),
        }).addClass("node-menu-rel-name");
        c1.append(spn).appendTo(row);
        var c2  = $('<td></td>');
        var btn = $('<button/>', {
            text: '',
            click: function(e) {
                graph.handler.deleteRelButtonClick(rel.source.id, rel.target.id, rel.rel);
            }
        }).addClass('dialog-button');
        c2.append(btn).appendTo(row);
        table.append(row);
    });
    $(this.labels.nodeMenuRels).html(table);
    $(this.identifiers.nodeMenu).dialog("open");
    $(graph.ui.buttons.dialogButtons).blur();
}

Graffeine.ui.prototype.hideNodeMenu = function() {
    $(this.labels.nodeMenuRels).html("");
    $(this.identifiers.nodeMenu).dialog("close");
}

/**
 *  Disable/Enable node action buttons
**/

Graffeine.ui.prototype.disableActionButtons = function(active) {
    $(this.buttons.nodeUpdate).prop('disabled',    active);
    $(this.buttons.nodeDelete).prop('disabled',    active);
    $(this.buttons.nodeDuplicate).prop('disabled', active);
};

Graffeine.ui.prototype.disableGraphActionButtons = function(active) {
    $(this.buttons.graphForceStart).prop('disabled', active);
    $(this.buttons.graphForceStop).prop('disabled', active);
};

Graffeine.ui.prototype.markNodeAsSelected = function(element) {
    element.setAttribute("class",
        element.getAttribute("class") + " " + Graffeine.conf.graphSettings.selectedClass);
};

Graffeine.ui.prototype.markNodeAsUnselected = function(element) {
    var re = new RegExp(" " + Graffeine.conf.graphSettings.selectedClass, 'g');
    var newClass = element.getAttribute("class").replace(re, '');
    element.setAttribute("class", newClass);
};

/**
 *  Pop up menu to determine type of new relationships
**/

Graffeine.ui.prototype.showNewRelationshipMenu = function(nodeSource, nodeTarget) {
    graph.state.newRelDialog = true;
    $(this.labels.relDialogSource).html(nodeSource.getName());
    $(this.labels.relDialogTarget).html(nodeTarget.getName());
    var linkTypes = graph.data.linkTypes;
    linkTypes.forEach(function(rel){
        $(graph.ui.labels.relDialogOptions)
            .append($("<option></option>")
            .attr("value",rel)
            .text(rel));
    });
    $(graph.ui.identifiers.relDialog).dialog("open");
    $(graph.ui.buttons.dialogButtons).blur();
};

/**
 *  Tidy up after a drag and drop, regardless of the connection-making outcome
**/

Graffeine.ui.prototype.clearDrag = function() {
    $("#new-relationship-dialog-name").val("");
    $(this.labels.relDialogSource).html("");
    $(this.labels.relDialogTarget).html("");
    $(this.labels.relDialogOptions).find('option').remove()
    graph.state.newRelDialog = false;        
    graph.state.sourceNode   = null;
    graph.state.hoveredNode  = null;
    graph.state.draggedNode  = null;
    graph.refs.svg.selectAll(".connector").remove();
}

Graffeine.ui.prototype.hideDialogs = function() {
    $(".dialog").hide();
}
/**
 *  register event handlers for various button clicks in ui
 *
 *  @todo move all "#blahblah" tag definitions to tags.js
**/

Graffeine.ui.prototype.registerButtonClicks = function() {

    $("#graph-init").click(function(e) {
        var start = $('#graph-start').val();
        graph.command.send('graph-init', { });
    });

    $("#graph-fetch").click(function(e) {
        var start = $('#graph-start').val();
        graph.command.send('graph-fetch', { start: start });
    });

    $("#graph-force-start").click(function(e) {
        graph.ui.forceStart();
    });

    $("#graph-force-stop").click(function(e) {
        graph.ui.forceStop();
    });

    $(this.buttons.nodeFind).click(function(e) {
        var name = $(graph.ui.labels.nodeFindName).val();
        var type = $(graph.ui.labels.nodeFindTypes).find(":selected").text();
        graph.debugMesg("(click:node:find) finding node : " + name + " of type " + type);
        graph.command.send('node-find', { name: name, type: type });
    });

    $("#node-edit-update").click(function(e) {
        var newObj = Graffeine.util.formToObject('node-data');
        var nodeId = graph.state.selectedNode.data.id;
        graph.command.send('node-update', { id: nodeId, data: newObj });
    });

    $(this.buttons.nodeDuplicate).click(function(e) {
        graph.debugMesg("(click:node:duplicate) duplicating node");
        var newObj = Graffeine.util.formToObject(graph.ui.identifiers.nodeEditableData.replace(/#/,''));
        graph.command.send('node-add', newObj);
    });

    $('#graph-mode').click(function(e) {
        if($('#graph-mode').text() === "update") {
            $('#graph-mode').text("replace");
            graph.replace = true;
        }
        else {
            $('#graph-mode').text("update");
            graph.replace = false;
        }
    });

    $("#nodes-orphans").click(function(e) {
        graph.command.send('nodes-orphans', { });
    });

    $("#node-add").click(function(e) {
        var nodeName = $(graph.ui.labels.nodeNewName).val();
        if($(graph.ui.labels.nodeNewType).val() !== '') {
            var nodeType = $(graph.ui.labels.nodeNewType).val();
        }
        else {
            var nodeType = $(graph.ui.labels.nodeAddNewTypes).find(":selected").text();
        }
        graph.command.send('node-add', { type: nodeType, name: nodeName });
    });

    $(this.buttons.nodeDelete).click(function(e) {
        if(graph.state.selectedNode !== null) {
            var nodeId = graph.state.selectedNode.data.id;
            graph.command.send('node-delete', { id: nodeId });
            graph.unselectNode();
        }
        else {

        }
    });

}

// main divs and float (dialog) parts of UI

Graffeine.ui.prototype.identifiers = {
    graphPlaceholder: '#graph',                                 // where the graph svg gets appended
    mainMenu:         '#menu',                                  // html section for main big side menu
    nodeEditToggle:   '#node-edit-toggle',                      // html section to hide/unhide on node select
    nodeEditableData: '#node-data',                             // html form section for managing node data
    nodeInfo:         '#node-info',                             // html float, shown on mouseover, for node information
    nodeInfoRels:     '#node-rels',                             // --> rels info inside nodeInfo html floater
    relDialog:        '#new-relationship-dialog-form',          // new rel dialog
    nodeMenu:         '#node-menu',                             // html float, shown on right click, for node editing
    notThere:         '#not-there'
};

// buttons within divs and floats

Graffeine.ui.prototype.buttons = {
    nodeDelete:       '#node-edit-delete',                      // button to delete currently selected node
    nodeDuplicate:    '#node-edit-duplicate',                   // button to make copy of selected node
    nodeUpdate:       '#node-edit-update',                      // button to update node with form data
    nodeFind:         '#node-find-button',                      // button to find node in db by name/type
    graphInit:        '#graph-init',                            // button to open the db connection and start the graph
    graphForceStart:  '#graph-force-start',                     // button to manually start the animation
    graphForceStop:   '#graph-force-stop',                      // button to manually stop the animation
    dialogButtons:    '.dialog-button'                          // dialog buttons (e.g. delete relationship)
};

// updatable labelled areas with divs and floats

Graffeine.ui.prototype.labels = {
    relDialogSource:  '#new-relationship-dialog-source',        // source node in new rel dialog
    relDialogTarget:  '#new-relationship-dialog-target',        // target node in new rel dialog
    relDialogOptions: '#new-relationship-dialog-options',       // <select><options> list in new rel dialog
    nodeMenuRels:     '#node-menu-rels',                        // list of rels inside the node menu dialog
    nodesCount:       '#db-node-max',                           // console location for total nodes in db
    relsCount:        '#db-rels-max',                           // console location for total rels in db
    nodeNewName:      '#node-new-name',                         // name of new node to create (on main menu)
    nodeNewType:      '#node-new-type',                         // type of new node to create (on main menu)
    nodeFindName:     '#node-find-name',                        // input:text field for finding node by name
    nodeAddNewTypes:  '#node-add-new-types-list',               // select list of known nodes types (on main menu)
    nodeFindTypes:    '#node-find-types-list',                  // select list of known nodes types (on main menu)
    graphStartNodeId: '#graph-start',                           // node id to start the next graph fetch from
    nodeSelectedId:   '#node-selected-id',                      // console metric showing id of last selected node
    nodeSelectedRels: '#node-selected-degrees'                  // degrees/relatiionships of last selected node
};
/**
 *  Graffeine UI event handlers
 *
 *  @namespace Graffeine.eventHandler
 */

Graffeine.eventHandler = function(graph) {

    this.graph = graph;

}
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
    return function(d,i){

        // TODO - there is a better idiomatic way of doing this with D3
        // that doesn't use cx-home etc

        d3.select(this).attr( 'pointer-events', '');
        d3.select(this)
            .attr('cx', d3.select(this).attr('cx-home'))
            .attr('cy', d3.select(this).attr('cy-home'));

        if(graph.state.hoveredNode !== null) {
            graph.ui.showNewRelationshipMenu(graph.state.sourceNode, graph.state.hoveredNode);
        }
        else {
            graph.ui.clearDrag();
        }
    };
};
/**
 *  Handle mouse-over on link/relation
**/

Graffeine.eventHandler.prototype.linkMouseover = function() {
    return function(d, i) {
        graph.debugMesg("(linkMouseover) processing");
        Graffeine.graph.tooltip.transition()
            .duration(200)
            .style("opacity", .9);

        Graffeine.graph.tooltip.html(
            "From : " + d.source.name + "<br/>" +
            "To :   " + d.target.name + "<br/>" +
            "Type : " + d.rel)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    };
};

/**
 *  Handler mouse-out on links/relations
**/

Graffeine.eventHandler.prototype.linkMouseout = function() {
    return function(d, i) {
        graph.debugMesg("(linkMouseout) processing");
        Graffeine.graph.tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    };
};

/**
 *  Handle right-clicks on links
**/

Graffeine.eventHandler.prototype.linkRightClick = function() {
    return function(d, i) {
        graph.debugMesg("(linkRightClick) processing");
        d3.event.stopPropagation();
        d3.event.preventDefault();
        graph.refs.force.stop();
        $("#node-menu").dialog({
            modal: true
        });
    };
};

/**
 *  Handle clicks on node/circle
**/

Graffeine.eventHandler.prototype.nodeClick = function() {
    return function(d, i) {
        d3.event.stopPropagation();
        graph.refs.force.stop();
        graph.ui.hideNodeInformation();
        if(graph.state.selectedNode===null) {
            graph.debugMesg("(click) set new selected node");
            graph.selectNode(d, this);
            graph.ui.markNodeAsSelected(this);
            graph.ui.updateWithConsoleNodeId(d);
            graph.ui.showNodeEditForm(d);
        }
        else {
            if(graph.state.selectedNode.elem!==this) {
                graph.debugMesg("(click) change selected node");
                graph.ui.markNodeAsUnselected(graph.state.selectedNode.elem);
                graph.selectNode(d, this);
                graph.ui.markNodeAsSelected(this);
                graph.ui.updateWithConsoleNodeId(d);
                graph.ui.showNodeEditForm(d);
            }
            else {
                graph.debugMesg("(click) remove selected node");
                graph.ui.markNodeAsUnselected(this);
                graph.unselectNode();
                graph.ui.updateWithConsoleNodeId();
                graph.ui.clearNodeMenuData();
            }
        }
    };
};

/**
 *  Handle double-click on node/circle
**/

Graffeine.eventHandler.prototype.nodeDoubleClick = function() {
    return function(d, i) {
        graph.debugMesg("(nodeDoubleClick) fetching new graph start from " + d.id);
        graph.command.send('graph-fetch', { start: d.id });
    };
};

/**
 *  Handle mouseover on node/circle
**/

Graffeine.eventHandler.prototype.nodeMouseover = function() {
    return function(d, i) {
        graph.debugMesg("(nodeMouseover) on node " + d.id);
        var r = d3.select(this).attr('r');
        d3.select(this)
            .transition()
            .attr('r', Graffeine.conf.graphSettings.circleRadius + 5)
            .ease("elastic");

        if(graph.state.sourceNode !== null) {
            graph.state.hoveredNode = d;
            d3.select(this).classed('joiner', true);
        }

        // only show info if no drag in progress

        if(graph.state.draggedNode === null)
            graph.ui.showNodeInformation(d);

    };
};

/**
 *  Handle mouseout on node/circle
**/

Graffeine.eventHandler.prototype.nodeMouseout = function() {
    return function(d, i) {
        graph.debugMesg("(nodeMouseover) hiding information for node " + d.id);
        d3.select(this)
            .transition()
            .attr('r', Graffeine.conf.graphSettings.circleRadius)
            .ease("elastic");
        d3.select(this)
            .classed('joiner', false);

        // remove this node from the hoveredNode (nodeTarget) state if
        // (a) the ui is in the middle of a drag and (b) there's no rel dialog

        if(graph.state.sourceNode !== null && !graph.state.newRelDialog) {
            graph.state.hoveredNode = null;
        }

        graph.ui.hideNodeInformation();

    };
};

/**
 *  Handle right-clicks on node
**/

Graffeine.eventHandler.prototype.nodeRightClick = function() {
    return function(d, i) {
        graph.debugMesg("(nodeRightClick) processing");
        graph.ui.hideNodeInformation();
        d3.event.stopPropagation();
        d3.event.preventDefault();
        graph.refs.force.stop();
        graph.ui.showNodeMenu(d);
    };
};
/**
 *  Handle clicks on svg
**/

Graffeine.eventHandler.prototype.svgClick = function() {
    return function(d, i) {
        graph.debugMesg("(svgClick) processing");
        graph.refs.force.stop();
        if(graph.state.selectedNode!==null) {
            graph.ui.markNodeAsUnselected(graph.state.selectedNode.elem);
            graph.ui.updateWithConsoleNodeId();
            graph.unselectNode();
            graph.ui.clearNodeMenuData();
        }
    };
};
/**
 *  Handle new relatiosnhip selected
**/

Graffeine.eventHandler.prototype.newRelSelected = function(newRelType) {
    if(newRelType !== null) {
        graph.connectNodes(graph.state.sourceNode, graph.state.hoveredNode, newRelType);
    }
};

/**
 *  Handle clicks on buttons to delete rels in node menu
**/

Graffeine.eventHandler.prototype.deleteRelButtonClick = function(source, target, rel) {
    graph.command.send('rel-delete', { source: source, target: target, rel: rel});
    graph.ui.hideNodeMenu();
};
