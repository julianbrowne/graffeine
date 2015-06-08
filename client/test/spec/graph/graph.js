
var graph; // @todo global

describe("Graph", function() { 

    beforeAll(function(done) { 
        require(["/lib/graffeine/loader.js"], function() { 
            console.log("test: loaded graffeine for spec");
            done();
        });
    });

    it("should have a Graffeine object", function() { 
        expect(Graffeine).toBeDefined();
    });

    it("should add a node", function() { 
        var g = new Graffeine.graph();
        g.addNode({ id: 1, name: "a" });
        expect(graffeineTestHelper.objectLength(g.data.nodes)).toEqual(1);
        g.addNode({ id: 2, name: "b" });
        expect(graffeineTestHelper.objectLength(g.data.nodes)).toEqual(2);
    });

    it("should fetch a node", function() { 
        var g = new Graffeine.graph();
        var nodeData = { id: 56, name: "a" };
        g.addNode(nodeData);
        var node = g.getNode(56);
        expect(node.id).toEqual(56);
        expect(node.getName()).toEqual("a");
    });

    it("should know if a node exists", function() { 
        var g = new Graffeine.graph();
        var nodeData = { id: 99, name: "a" };
        g.addNode(nodeData);
        var nodeTrue = g.nodeExists(99);
        var nodeFalse = g.nodeExists(123);
        expect(nodeTrue).toBe(true);
        expect(nodeFalse).toBe(false);
    });

    it("should remove a node", function() { 
        var g = new Graffeine.graph();
        var nodeData = { id: 12, name: "a" };
        g.addNode(nodeData);
        expect(g.nodeExists(12)).toBe(true);
        expect(graffeineTestHelper.objectLength(g.data.nodes)).toEqual(1);
        g.removeNode(123); // non existent delete
        expect(g.nodeExists(12)).toBe(true);
        expect(graffeineTestHelper.objectLength(g.data.nodes)).toEqual(1);
        g.removeNode(12);
        expect(g.nodeExists(12)).toBe(false);
        expect(graffeineTestHelper.objectLength(g.data.nodes)).toEqual(0);
    });

    it("should clear all nodes", function() { 
        var g = new Graffeine.graph();
        var nodeData1 = { id: 1, name: "a" };
        var nodeData2 = { id: 2, name: "b" };
        var nodeData3 = { id: 3, name: "c" };
        g.addNode(nodeData1);
        g.addNode(nodeData2);
        g.addNode(nodeData3);
        expect(graffeineTestHelper.objectLength(g.data.nodes)).toEqual(3);
        g.clearNodes();
        expect(g.nodeExists(1)).toBe(false);
        expect(g.nodeExists(2)).toBe(false);
        expect(g.nodeExists(3)).toBe(false);
        expect(graffeineTestHelper.objectLength(g.data.nodes)).toEqual(0);
    });

    it("should count nodes", function() { 
        var g = new Graffeine.graph();
        var nodeData1 = { id: 1, name: "a" };
        var nodeData2 = { id: 2, name: "b" };
        var nodeData3 = { id: 3, name: "c" };
        g.addNode(nodeData1);
        g.addNode(nodeData2);
        g.addNode(nodeData3);
        expect(graffeineTestHelper.objectLength(g.data.nodes)).toEqual(3);
        var count = g.nodeCount();
        expect(count).toEqual(3);
    });

    it("should add node types", function() { 
        var g = new Graffeine.graph();
        g.addNodeType("a");
        g.addNodeType("b");
        g.addNodeType("c");
        expect(graffeineTestHelper.objectLength(g.data.nodeTypes)).toEqual(3);
        g.addNodeType("a");
        g.addNodeType("a");
        g.addNodeType("a");
        expect(graffeineTestHelper.objectLength(g.data.nodeTypes)).toEqual(3);
    });

    it("should count node types", function() { 
        var g = new Graffeine.graph();
        g.addNodeType("a");
        var count = g.nodeTypeCount();
        expect(count).toEqual(1);
        g.addNodeType("b");
        count = g.nodeTypeCount();
        expect(count).toEqual(2);
    });

    it("should clear node types", function() { 
        var g = new Graffeine.graph();
        g.addNodeType("a");
        g.addNodeType("b");
        var count = g.nodeTypeCount();
        expect(count).toEqual(2);
        g.clearNodeTypes();
        count = g.nodeTypeCount();
        expect(count).toEqual(0);
        expect(graffeineTestHelper.objectLength(g.data.nodeTypes)).toEqual(0);
    });

    it("should add a path", function() { 
        var g = new Graffeine.graph();
        var nodeSource = { id: 1, name: "a" };
        var nodeTarget = { id: 2, name: "b" };
        g.addNode(nodeSource);
        g.addNode(nodeTarget);
        g.addPath(1,2,"knows");
        expect(g.nodeCount()).toEqual(2);
        expect(graffeineTestHelper.objectLength(g.data.paths)).toEqual(1);
    });

    it("should fetch a path", function() { 
        var g = new Graffeine.graph();
        var nodeSource = { id: 1, name: "a" };
        var nodeTarget = { id: 2, name: "b" };
        g.addNode(nodeSource);
        g.addNode(nodeTarget);
        g.addPath(1,2,"knows");
        var path = g.getPath(1,2,"knows");
        expect(path.source.id).toEqual(1);
        expect(path.target.id).toEqual(2);
        expect(path.name).toEqual("knows");
    });

    it("should know if a path exists", function() { 
        var g = new Graffeine.graph();
        var nodeSource = { id: 1, name: "a" };
        var nodeTarget = { id: 2, name: "b" };
        g.addNode(nodeSource);
        g.addNode(nodeTarget);
        g.addPath(1,2,"knows");
        var pathTrue = g.pathExists(1,2,"knows");
        var pathFalse = g.pathExists(2,3,"knows");
        expect(pathTrue).toEqual(true);
        expect(pathFalse).toEqual(false);
    });

    it("should remove a path", function() { 
        var g = new Graffeine.graph();
        var nodeSource = { id: 1, name: "a" };
        var nodeTarget = { id: 2, name: "b" };
        g.addNode(nodeSource);
        g.addNode(nodeTarget);
        g.addPath(1,2,"knows");
        var pathExists = g.pathExists(1,2,"knows");
        expect(pathExists).toEqual(true);
        g.removePath(1,2,"knows");
        pathExists = g.pathExists(1,2,"knows");
        expect(pathExists).toEqual(false);
        expect(graffeineTestHelper.objectLength(g.data.paths)).toEqual(0);
    });

    it("should clear paths", function() { 
        var g = new Graffeine.graph();
        var nodeSource = { id: 1, name: "a" };
        var nodeTarget = { id: 2, name: "b" };
        g.addNode(nodeSource);
        g.addNode(nodeTarget);
        g.addPath(1,2,"knows");
        g.addPath(2,1,"knows");
        g.addPath(1,2,"hears");
        expect(graffeineTestHelper.objectLength(g.data.paths)).toEqual(3);
        g.clearPaths();
        expect(graffeineTestHelper.objectLength(g.data.paths)).toEqual(0);
    });

    it("should count paths", function() { 
        var g = new Graffeine.graph();
        var nodeSource = { id: 1, name: "a" };
        var nodeTarget = { id: 2, name: "b" };
        g.addNode(nodeSource);
        g.addNode(nodeTarget);
        expect(g.pathCount()).toEqual(0);
        g.addPath(1,2,"knows");
        expect(g.pathCount()).toEqual(1);
        g.addPath(2,1,"knows");
        expect(g.pathCount()).toEqual(2);
        g.addPath(1,2,"hears");
        expect(g.pathCount()).toEqual(3);
    });

    it("should add path types", function() { 
        var g = new Graffeine.graph();
        g.addPathType("knows");
        g.addPathType("hears");
        g.addPathType("sees");
        expect(graffeineTestHelper.objectLength(g.data.pathTypes)).toEqual(3);
        g.addPathType("knows");
        g.addPathType("knows");
        g.addPathType("knows");
        expect(graffeineTestHelper.objectLength(g.data.pathTypes)).toEqual(3);
    });

    it("should count path types", function() { 
        var g = new Graffeine.graph();
        g.addPathType("knows");
        g.addPathType("hears");
        g.addPathType("sees");
        expect(g.pathTypeCount()).toEqual(3);
        g.addPathType("knows");
        g.addPathType("knows");
        g.addPathType("knows");
        expect(g.pathTypeCount()).toEqual(3);
    });

    it("should clear path types", function() { 
        var g = new Graffeine.graph();
        g.addPathType("knows");
        g.addPathType("hears");
        g.addPathType("sees");
        expect(g.pathTypeCount()).toEqual(3);
        g.clearPathTypes();
        expect(g.pathTypeCount()).toEqual(0);
    });

    it("should empty graph", function(done) { 
        expect(graph.nodeCount()).toEqual(0); // @todo global
        var data = JSON.parse(graffeineTestData.oneNode);
        Graffeine.socket().$events["node-add"](data);
        graph.forceStop(); // @todo global
        expect(graph.nodeCount()).toEqual(1); // @todo global
        graph.empty(); // @todo global
        expect(graph.nodeCount()).toEqual(0); // @todo global
        graph.empty(); // @todo global
        done();
    });

    it("should add mixed data", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph");
        var data = JSON.parse(graffeineTestData.tenNodes);
        graph.addGraphData(data);
        expect(graph.nodeCount()).toEqual(10);
        expect(graph.pathCount()).toEqual(5);
        expect(graph.nodeTypeCount()).toEqual(8);
        expect(graph.pathTypeCount()).toEqual(4);
        graph.empty(); 
        done();
    });

});