
Graffeine.graph = (function(G) { 

//    var socket = null;
    var ui = G.ui;
    var debug = false;
    var updateMode = 'replace'; // {'update'|'replace'} for new svg data

    var data = { 
        nodeTypes: [],  // types of node (person, dog, cat, etc)
        pathTypes: [],  // types of relationship (knows, etc)
        nodes: {},      // nodes in the graph
        paths: []       // relationships between nodes
    };

    function checkPaths() { 
        var nodes = data.nodes;
        data.paths = $.grep(data.paths, function(path) { 
            return (nodes[path.source.id]!==undefined && nodes[path.target.id]!==undefined)
        });
    };

    function resetPaths() { 
        var self = this;
        data.paths.forEach(function(path) { 
            path.source = self.getNode[path.source.id];
            path.target = self.getNode[path.target.id];
        });
    };

    function addGraphData(graphData) { 
        if(updateMode==="replace") init();
        /**
         *  Process all nodes *then* all relationhsips.
         *  Innefficient, but it does ensure
         *  that relationships created are between nodes
         *  in the visual display and not just referred
         *  to in the original cypher result
         *
        **/
        graphData.nodes.forEach(function(n) {
            if(n.node === 'n') addNode(n);
        });
        graphData.nodes.forEach(function(n) { 
            if(n.node === 'r') addPath(n.start, n.end, n.type);
        });
    };

    function refresh() { 
        var ui = G.ui;
        ui.nodeEdit.updateNodeTypes();
        ui.graphStats.refresh();
        if(updateMode==='replace'||$(G.config.graphTargetDiv).length === 0) { 
            G.svg.init();
        }
        checkPaths();
        G.svg.refresh();
    };

    function addNode(node, overrideMax) { 
        var overrideMax = overrideMax ? overrideMax : false;
        if(!overrideMax) { 
            if(nodeCount() > G.config.graphSettings.nodeLimit)
                return;
        }
        if(node===undefined||node.id === undefined) { 
            console.warn("addNode: adding node with bad data: %s", node);
            return;
        }
        var newNode = new G.model.Node(node);
        if(nodeExists(newNode.id))
            newNode.transferD3Data(getNode(newNode.id));
        data.nodes[newNode.id] = newNode;
        addNodeType(newNode.type);
    };

    function getNode(id) { 
        if(data.nodes[id]===undefined)
            console.warn("fetching non-existent node: %s", id);
        return data.nodes[id];
    };

    function nodeExists(id) { 
        return (data.nodes[id]===undefined) ? false : true;
    };

    function removeNode(id) { 
        if(data.nodes[id]===undefined)
            console.warn("deleting non-existent node: %s", id);
        if(!data.nodes.hasOwnProperty(id))
            return;
        delete data.nodes[id];
    };

    function clearNodes() { 
        data.nodes={};
    };

    function nodeCount() { 
        return Object.getOwnPropertyNames(data.nodes).length;
    };

    function addNodeType(type) { 
        data.nodeTypes.push(type);
        data.nodeTypes = data.nodeTypes.sort().filter(function(el,i,a) { 
            if(i===a.indexOf(el)) return 1;
            return 0;
        });
    };

    function nodeTypeCount() { 
        return data.nodeTypes.length;
    };

    function clearNodeTypes() { 
        data.nodeTypes=[];
    };

    function addPath(sourceIndex, targetIndex, pathName) { 

        if(typeof sourceIndex==="undefined") { console.error("addPath: no source node"); return; }
        if(typeof targetIndex==="undefined") { console.error("addPath: no target node"); return; }
        if(typeof pathName==="undefined") { console.error("addPath: no path name"); return; }

        if(!nodeExists(sourceIndex)&&!nodeExists(targetIndex)) { 
            console.warn("addPath: connecting non-existent nodes: %s to %s", sourceIndex, targetIndex);
            return;
        }
        else { 
            if(pathExists(sourceIndex, targetIndex, pathName))
                removePath(sourceIndex, targetIndex, pathName);

            var path = new G.model.Path(getNode(sourceIndex), getNode(targetIndex), pathName);

            /**
             *  Where there's a source node, but no target node, or vice versa
             *  mark node as an "edge" node and don't add the path
            **/

            if(!nodeExists(sourceIndex)) getNode(targetIndex).isEdgeNode = true;
            if(!nodeExists(targetIndex)) getNode(sourceIndex).isEdgeNode = true;

            if(!nodeExists(sourceIndex)||!nodeExists(targetIndex))
                return;

            data.paths.push(path);
            addPathType(pathName);
        }

    };

    function getPath(sourceId, targetId, name) { 
        if(pathCount()===0) return null;
        var paths = Graffeine.graph.paths();
        var match = $.grep(paths, function(p) { 
            return (p.source.id === sourceId && p.target.id === targetId && p.name === name);
        });
        return (match.length===0) ? null : match[0];
    };

    function pathExists(sourceId, targetId, name) { 
        if(pathCount()===0) return false;
        var path = getPath(sourceId, targetId, name);
        return (path !== null);
    };

    function removePath(sourceId, targetId, name) { 
        data.paths = data.paths.filter(function (p) { 
            return (p.source.id !== sourceId || p.target.id !== targetId || p.name !== name);
        });
    };

    function clearPaths() { 
        data.paths=[];
    };

    function pathCount() { 
        return data.paths.length;
    };

    function addPathType(type) { 
        if(data.pathTypes.indexOf(type)===-1)
            data.pathTypes.push(type);
    };

    function pathTypeCount() { 
        return data.pathTypes.length;
    };

    function clearPathTypes() { 
        data.pathTypes=[];
    };

    function debugMesg(mesg) { 
        if(debug) console.log("DEBUG : %s", mesg);
    };

    function empty() { 
        init();
        refresh();
    };

    function init() { 
//        socket = new io.connect(G.config.core.host)
        clearNodeTypes();
        clearPathTypes();
        clearNodes();
        clearPaths();
    };

    init();

    return { 
        nodeTypes: function() { return data.nodeTypes; },
        pathTypes: function() { return data.pathTypes; },
        nodes: function() { return data.nodes; },
        paths: function() { return data.paths; },
        empty: empty,
        addNode: addNode,
        getNode: getNode,
        nodeExists: nodeExists,
        removeNode: removeNode,
        clearNodes: clearNodes,
        nodeCount: nodeCount,
        addNodeType: addNodeType,
        nodeTypeCount: nodeTypeCount,
        clearNodeTypes: clearNodeTypes,
        getPath: getPath,
        addPath: addPath,
        removePath: removePath,
        pathExists: pathExists,
        addPathType: addPathType,
        pathCount: pathCount,
        clearPaths: clearPaths,
        clearPathTypes: clearPathTypes,
        resetPaths: resetPaths,
        pathTypeCount: pathTypeCount,
        addGraphData: addGraphData,
        refresh: refresh,
        checkPaths: checkPaths,
        data: data
    }

}(Graffeine));
