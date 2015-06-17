
Graffeine.graph = (function(G) { 

//    var socket = null;
    var ui = G.ui;
    var debug = false;
    var updateMode = 'replace'; // {'update'|'replace'} for new svg data

    var data = { 
        nodes: {},      // nodes in the graph
        paths: [],      // relationships between nodes
        nodeTypes: [],  // types of node (person, dog, cat, etc)
        pathTypes: [],  // types of relationship (knows, etc)
        labels: []      // node labels
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
        console.log("populated graph with %s nodes", nodeCount());
        graphData.nodes.forEach(function(p) { 
            if(p.node === 'r') addPath(p.start, p.end, p.type);
        });
        console.log("populated graph with %s paths", pathCount());
    };

    function refresh() { 
        var ui = G.ui;
        ui.nodeEdit.updateNodeTypes();
        if(updateMode==='replace'||$(G.config.graphTargetDiv).length === 0) { 
            G.svg.init();
        }
        checkPaths();
        G.svg.refresh();
    };

    function addNode(node) { 
        if(node===undefined||node === null) { 
            console.warn("graph.addNode: node with bad data");
            return;
        }
        var newNode = new G.model.Node(node);
        if(nodeExists(newNode.id))
            newNode.transferD3Data(getNode(newNode.id));
        data.nodes[newNode.id] = newNode;
        addNodeType(newNode.type);
        addNodeLabels(newNode.labels);
    };

    function getNode(id) { 
        if(data.nodes[id]===undefined) { 
            console.warn("graph.getNode: fetching non-existent node: %s", id);
        }
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
        if(data.nodeTypes.indexOf(type)===-1) {
            data.nodeTypes.push(type);
            data.nodeTypes = data.nodeTypes.sort()
        }
    };

    function addNodeLabels(labels) { 
        data.labels = data.labels.concat(labels);
        data.labels = data.labels.sort().filter(function(el,i,a) { 
            return (i==a.indexOf(el));
        });
    };

    function addPathType(type) { 
        if(data.pathTypes.indexOf(type)===-1) { 
            data.pathTypes.push(type);
            data.nodeTypes = data.nodeTypes.sort()
        }
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

    function pathTypeCount() { 
        return data.pathTypes.length;
    };

    function clearPathTypes() { 
        data.pathTypes=[];
    };

    function debugMesg(mesg) { 
        if(debug) console.log("DEBUG : %s", mesg);
    };

    function clear() { 
        Graffeine.svg.forceStop();
        init();
        refresh();
    };

    function init() { 
        clearNodeTypes();
        clearPathTypes();
        clearNodes();
        clearPaths();
    };

    // init();

    return { 
        nodes: function() { return data.nodes; },
        paths: function() { return data.paths; },
        getNodeTypes: function() { return data.nodeTypes; },
        getPathTypes: function() { return data.pathTypes; },
        getNodeLabels: function() { return data.labels; },
        init: init,
        clear: clear,
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
