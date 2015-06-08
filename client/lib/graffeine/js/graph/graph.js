/**
 *  Central Graffeine Graph object
 *
 *  @constructor
 *  @this {graph}
 *  @param {string} [divRoot='body'] html selector to attach svg to. Defaults to doc body
 *  @return {graph} New graph object
 *
**/

Graffeine.graph = function() { 

    this.data = {
        nodeTypes: [],  // types of node (person, dog, cat, etc)
        pathTypes: [],  // types of relationship (knows, etc)
        nodes: {},      // nodes in the graph
        paths: []       // relationships between nodes
    };

    this.refs = {
        div:      "#graph",     // ref to div to hold svg
        svg:      null,         // ref to root svg element
        force:    null,         // ref to d3 force calc
        defs:     null,         // ref to svg defs section
        path:     null,         // ref to svg path (relationship) elems
        pathIcon: null,         // ref to image that sits on path elem
        circle:   null,         // ref to svg circle (node) elems
        draglet:  null,         // ref to svg circle (draglet) elems
        text:     null,         // ref to svg text (node label) elems
        icon:     null,         // ref to svg text (node icon) elems
        tooltip:  null,         // ref to tooltip for paths/rels
        linkMenu: null,         // TODO: investigate use then maybe delete?
    };

    this.state = { 
        connected: false,      // currently connected to neo4j (or not)
        forceActive: false,    // forced layout ticks currently active (or not)
        selectedNode: null,    // ref to currently selected/highlighted node
        sourceNode: null,      // ref to origin node of draglet drag
        draggedNode: null,     // ref to currently dragged draglet node
        newPathActive: false,  // ref to flag showing whether new relationship dialog is up
        hoveredNode: null      // ref to currently hovered over node during a drag
    };

    // wire in socket, command, ui and event handlers

    this.socket      = new io.connect(Graffeine.config.core.host);
    //this.command     = new Graffeine.command(this);
    this.ui          = new Graffeine.ui(this);
    this.handler     = new Graffeine.eventHandler(this);

    this.settings    = Graffeine.config.graphSettings;
    this.debug       = false;
    this.updateMode  = 'replace';           // {'update'|'replace'} for new svg data

    this.width       = Graffeine.config.graphSettings.width;
    this.height      = Graffeine.config.graphSettings.height;

    this.addNode = function(node, overrideMax) { 

        var overrideMax = overrideMax ? overrideMax : false;

        if(!overrideMax) { 
            if(this.nodeCount() > Graffeine.config.graphSettings.nodeLimit)
                return;
        }

        if(node===undefined||node.id === undefined) { 
            console.warn("addNode: adding node with bad data: %s", node);
            return;
        }

        var newNode = new Graffeine.model.Node(node);

        if(this.nodeExists(newNode.id))
            newNode.transferD3Data(this.getNode(newNode.id));

        this.data.nodes[newNode.id] = newNode;
        this.addNodeType(newNode.type);

    };

    this.getNode = function(id) { 
        if(this.data.nodes[id]===undefined)
            console.warn("fetching non-existent node: %s", id);
        return this.data.nodes[id];
    };

    this.nodeExists = function(id) { 
        return (this.data.nodes[id]===undefined) ? false : true;
    };

    this.removeNode = function(id) {
        if(this.data.nodes[id]===undefined)
            console.warn("deleting non-existent node: %s", id);
        if(!this.data.nodes.hasOwnProperty(id))
            return;
        delete this.data.nodes[id];
    };

    this.clearNodes = function() { 
        this.data.nodes={};
    };

    this.nodeCount = function() { 
        return Object.getOwnPropertyNames(this.data.nodes).length;
    };

    this.addNodeType = function(type) { 
        this.data.nodeTypes.push(type);
        this.data.nodeTypes = this.data.nodeTypes.sort().filter(function(el,i,a) { 
            if(i===a.indexOf(el)) return 1;
            return 0;
        });
    };

    this.nodeTypeCount = function() { 
        return this.data.nodeTypes.length;
    };

    this.clearNodeTypes = function() { 
        this.data.nodeTypes=[];
    };

    this.addPath = function(sourceIndex, targetIndex, pathName) { 

        if(typeof sourceIndex==='undefined') { 
            console.error("addPath: no source node");
            return;        
        }

        if(typeof targetIndex==='undefined') { 
            console.error("addPath: no target node");
            return;
        }

        if(typeof pathName==='undefined') { 
            console.error("addPath: no path name");
            return;
        }

        if(!this.nodeExists(sourceIndex)&&!this.nodeExists(targetIndex)) { 
            console.warn("addPath: connecting two non-existent nodes: %s to %s", sourceIndex, targetIndex);
            return;
        }
        else { 
            if(this.pathExists(sourceIndex, targetIndex, pathName))
                this.removePath(sourceIndex, targetIndex, pathName);

            var path = new Graffeine.model.Path(this.getNode(sourceIndex), this.getNode(targetIndex), pathName);

            /**
             *  Where there's a source node, but no target node, or vice versa
             *  mark this node as an "edge" node and don't add the path
            **/

            if(!this.nodeExists(sourceIndex)) this.getNode(targetIndex).isEdgeNode = true;
            if(!this.nodeExists(targetIndex)) this.getNode(sourceIndex).isEdgeNode = true;

            if(!this.nodeExists(sourceIndex)||!this.nodeExists(targetIndex))
                return;

            this.data.paths.push(path);
            this.addPathType(pathName);
        }

    };

    this.getPath = function(source, target, name) { 
        // @todo: remove underscore dependency
        var match = _.find(this.data.paths, function(path){ 
            return (path.source.id === source && path.target.id === target && path.name === name);
        });
        return match||undefined;
    };

    this.pathExists = function(source, target, name) { 
        if(this.pathCount()===0) return false;
        // @todo: remove underscore dependency
        var match = _.find(this.data.paths, function(path) { 
            return (path.source.id === source && path.target.id === target && path.name === name);
        });
        return (match !== undefined);
    };

    this.removePath  = function(source, target, name) { 
        // @todo: remove underscore dependency
        this.data.paths = _.reject(this.data.paths, function(path) { 
            return (path.source.id === source && path.target.id === target && path.name === name);
        });
    };

    this.clearPaths = function() { 
        this.data.paths=[];
    };

    this.pathCount = function() { 
        return this.data.paths.length;
    };

    this.addPathType = function(type) { 
        if(this.data.pathTypes.indexOf(type)===-1)
            this.data.pathTypes.push(type);
    };

    this.pathTypeCount = function() { 
        return this.data.pathTypes.length;
    };

    this.clearPathTypes = function() { 
        this.data.pathTypes=[];
    };

    this.debugMesg = function(mesg) { 
        if(this.debug)
            console.log("DEBUG : %s", mesg);
    };

    this.forceStart = function() { 
        if(this.state.forceActive) return;
        this.refs.force.start();
    };

    this.forceStop = function() { 
        if(!this.state.forceActive) return;
        this.refs.force.stop();
    };

    this.empty = function() { 
        this.init();
        this.refresh();
    };

    this.init = function() { 
        this.clearNodeTypes();
        this.clearPathTypes();
        this.clearNodes();
        this.clearPaths();
    };

    this.init();

};

/**
 *  Refresh the graph layout
 *  (e.g. after adding new nodes or relationships)
**/

Graffeine.graph.prototype.refresh  = function() { 

    var ui = Graffeine.ui;

    ui.nodeEdit.updateNodeTypes();
    ui.graphStats.refresh();

    if(this.updateMode === 'replace' || $(this.refs.div).length === 0) {
        this.makeSvg();
    }

    this.checkPaths();

    this.refs.force
        .nodes(d3.values(this.data.nodes), function(node) { return node.id; })
        .links(this.data.paths, function(path) { return path.source.id + "-" + path.target.id; });

    this.drawPaths();
    this.drawPathIcons();
    this.drawNodes();
    this.drawLabels();

    this.refs.force
        .start();

};

/**
 *  Shorthand function to add multiple nodes and paths to the graph
 *
 *  @param {array} graphData array of standardised nodes and path objects
 *  extracted from neo4J
 *  @param {boolean} create if set to true (default) creates data structures
 *  otherwise (if set to false) will graph data to existing structures.
**/

Graffeine.graph.prototype.addGraphData = function(graphData) { 

    var graph = this;
    if(this.updateMode==="replace") this.init();

    /**
     *  Process all nodes _then_ all relationhsips
     *
     *  This is innefficient, but it does ensure
     *  that relationships created are between nodes
     *  in the visual display and not just referred
     *  to in the original cypher result
     *
    **/

    graphData.nodes.forEach(function(n) {
        if(n.node === 'n') graph.addNode(n);
    });

    graphData.nodes.forEach(function(n) { 
        if(n.node === 'r') graph.addPath(n.start, n.end, n.type);
    });

};

/**
 *  Resets paths to the node instances referred to
**/

Graffeine.graph.prototype.resetPaths = function() { 
    var self = this;
    this.data.paths.forEach(function(path) { 
        path.source = self.getNode[path.source.id];
        path.target = self.getNode[path.target.id];
    });
};

/**
 *  Make sure all paths have existent nodes
**/

Graffeine.graph.prototype.checkPaths = function() {
    var nodes = this.data.nodes;
    this.data.paths = _.reject(this.data.paths, function(path){
        return (nodes[path.source.id]===undefined || nodes[path.target.id]===undefined)
    });
};

/**
 *  select a node/element
 *  unselect a node/element
 *  retreive information about the currently selected node/element
 *
 *  @todo refactor, along with the rest of the state toggles, into
 *  a UI state management object
**/

Graffeine.graph.prototype.selectNode = function(node, element) { 
    this.state.selectedNode={ data: node, elem: element };
};

Graffeine.graph.prototype.nodeSelected = function() { 
    return (this.state.selectedNode===null) ? false : true;
};

Graffeine.graph.prototype.unselectNode = function() { 
    this.state.selectedNode=null;
};

Graffeine.graph.prototype.getSelectedNode = function() { 
    if(this.state.selectedNode===null) return null;
    return this.state.selectedNode.data;
};
