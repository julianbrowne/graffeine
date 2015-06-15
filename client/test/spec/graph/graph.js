
var graph; // @todo global

describe("Graph", function() { 

    beforeAll(function(done) { 
        require(["/lib/graffeine/loader.js"], function() { 
            console.log("test: loaded graffeine for spec");
            Graffeine.init();
            done();
        });
    });

    it("should have a Graffeine object", function() { 
        expect(Graffeine).toBeDefined();
    });

    it("should add a node", function() { 
        Graffeine.init();
        Graffeine.graph.addNode({ id: 1, name: "a" });
        expect(graffeineTestHelper.objectLength(Graffeine.graph.nodes())).toEqual(1);
        Graffeine.graph.addNode({ id: 2, name: "b" });
        expect(graffeineTestHelper.objectLength(Graffeine.graph.nodes())).toEqual(2);
    });

    it("should fetch a node", function() { 
        Graffeine.init();
        var nodeData = { id: 56, name: "a" };
        Graffeine.graph.addNode(nodeData);
        var node = Graffeine.graph.getNode(56);
        expect(node.id).toEqual(56);
        expect(node.getName()).toEqual("a");
    });

    it("should know if a node exists", function() { 
        Graffeine.init();
        var nodeData = { id: 99, name: "a" };
        Graffeine.graph.addNode(nodeData);
        var nodeTrue = Graffeine.graph.nodeExists(99);
        var nodeFalse = Graffeine.graph.nodeExists(123);
        expect(nodeTrue).toBe(true);
        expect(nodeFalse).toBe(false);
    });

    it("should remove a node", function() { 
        Graffeine.init();
        var nodeData = { id: 12, name: "a" };
        Graffeine.graph.addNode(nodeData);
        expect(Graffeine.graph.nodeExists(12)).toBe(true);
        expect(graffeineTestHelper.objectLength(Graffeine.graph.nodes())).toEqual(1);
        Graffeine.graph.removeNode(123); // non existent delete
        expect(Graffeine.graph.nodeExists(12)).toBe(true);
        expect(graffeineTestHelper.objectLength(Graffeine.graph.nodes())).toEqual(1);
        Graffeine.graph.removeNode(12);
        expect(Graffeine.graph.nodeExists(12)).toBe(false);
        expect(graffeineTestHelper.objectLength(Graffeine.graph.nodes())).toEqual(0);
    });

    it("should clear all nodes", function() { 
        Graffeine.init();
        var nodeData1 = { id: 1, name: "a" };
        var nodeData2 = { id: 2, name: "b" };
        var nodeData3 = { id: 3, name: "c" };
        Graffeine.graph.addNode(nodeData1);
        Graffeine.graph.addNode(nodeData2);
        Graffeine.graph.addNode(nodeData3);
        expect(graffeineTestHelper.objectLength(Graffeine.graph.nodes())).toEqual(3);
        Graffeine.graph.clearNodes();
        expect(Graffeine.graph.nodeExists(1)).toBe(false);
        expect(Graffeine.graph.nodeExists(2)).toBe(false);
        expect(Graffeine.graph.nodeExists(3)).toBe(false);
        expect(graffeineTestHelper.objectLength(Graffeine.graph.nodes())).toEqual(0);
    });

    it("should count nodes", function() { 
        Graffeine.init();
        var nodeData1 = { id: 1, name: "a" };
        var nodeData2 = { id: 2, name: "b" };
        var nodeData3 = { id: 3, name: "c" };
        Graffeine.graph.addNode(nodeData1);
        Graffeine.graph.addNode(nodeData2);
        Graffeine.graph.addNode(nodeData3);
        expect(graffeineTestHelper.objectLength(Graffeine.graph.nodes())).toEqual(3);
        var count = Graffeine.graph.nodeCount();
        expect(count).toEqual(3);
    });

    it("should add node types", function() { 
        Graffeine.init();
        Graffeine.graph.addNodeType("a");
        Graffeine.graph.addNodeType("b");
        Graffeine.graph.addNodeType("c");
        expect(graffeineTestHelper.objectLength(Graffeine.graph.getNodeTypes())).toEqual(3);
        Graffeine.graph.addNodeType("a");
        Graffeine.graph.addNodeType("a");
        Graffeine.graph.addNodeType("a");
        expect(graffeineTestHelper.objectLength(Graffeine.graph.getNodeTypes())).toEqual(3);
    });

    it("should count node types", function() { 
        Graffeine.init();
        Graffeine.graph.addNodeType("a");
        var count = Graffeine.graph.nodeTypeCount();
        expect(count).toEqual(1);
        Graffeine.graph.addNodeType("b");
        count = Graffeine.graph.nodeTypeCount();
        expect(count).toEqual(2);
    });

    it("should clear node types", function() { 
        Graffeine.init();
        Graffeine.graph.addNodeType("a");
        Graffeine.graph.addNodeType("b");
        var count = Graffeine.graph.nodeTypeCount();
        expect(count).toEqual(2);
        Graffeine.graph.clearNodeTypes();
        count = Graffeine.graph.nodeTypeCount();
        expect(count).toEqual(0);
        expect(graffeineTestHelper.objectLength(Graffeine.graph.getNodeTypes())).toEqual(0);
    });

    it("should add a path", function() { 
        Graffeine.init();
        var nodeSource = { id: 1, name: "a" };
        var nodeTarget = { id: 2, name: "b" };
        Graffeine.graph.addNode(nodeSource);
        Graffeine.graph.addNode(nodeTarget);
        Graffeine.graph.addPath(1,2,"knows");
        expect(Graffeine.graph.nodeCount()).toEqual(2);
        expect(graffeineTestHelper.objectLength(Graffeine.graph.paths())).toEqual(1);
    });

    it("should fetch a path", function() { 
        Graffeine.init();
        var nodeSource = { id: 1, name: "a" };
        var nodeTarget = { id: 2, name: "b" };
        Graffeine.graph.addNode(nodeSource);
        Graffeine.graph.addNode(nodeTarget);
        Graffeine.graph.addPath(1,2,"knows");
        var path = Graffeine.graph.getPath(1,2,"knows");
        expect(path.source.id).toEqual(1);
        expect(path.target.id).toEqual(2);
        expect(path.name).toEqual("knows");
    });

    it("should know if a path exists", function() { 
        Graffeine.init();
        var nodeSource = { id: 1, name: "a" };
        var nodeTarget = { id: 2, name: "b" };
        Graffeine.graph.addNode(nodeSource);
        Graffeine.graph.addNode(nodeTarget);
        Graffeine.graph.addPath(1,2,"knows");
        var pathTrue = Graffeine.graph.pathExists(1,2,"knows");
        var pathFalse = Graffeine.graph.pathExists(2,3,"knows");
        expect(pathTrue).toEqual(true);
        expect(pathFalse).toEqual(false);
    });

    it("should remove a path", function() { 
        Graffeine.init();
        var nodeSource = { id: 1, name: "a" };
        var nodeTarget = { id: 2, name: "b" };
        Graffeine.graph.addNode(nodeSource);
        Graffeine.graph.addNode(nodeTarget);
        Graffeine.graph.addPath(1,2,"knows");
        var pathExists = Graffeine.graph.pathExists(1,2,"knows");
        expect(pathExists).toEqual(true);
        Graffeine.graph.removePath(1,2,"knows");
        pathExists = Graffeine.graph.pathExists(1,2,"knows");
        expect(pathExists).toEqual(false);
        expect(graffeineTestHelper.objectLength(Graffeine.graph.paths())).toEqual(0);
    });

    it("should clear paths", function() { 
        Graffeine.init();
        var nodeSource = { id: 1, name: "a" };
        var nodeTarget = { id: 2, name: "b" };
        Graffeine.graph.addNode(nodeSource);
        Graffeine.graph.addNode(nodeTarget);
        Graffeine.graph.addPath(1,2,"knows");
        Graffeine.graph.addPath(2,1,"knows");
        Graffeine.graph.addPath(1,2,"hears");
        expect(graffeineTestHelper.objectLength(Graffeine.graph.paths())).toEqual(3);
        Graffeine.graph.clearPaths();
        expect(graffeineTestHelper.objectLength(Graffeine.graph.paths())).toEqual(0);
    });

    it("should count paths", function() { 
        Graffeine.init();
        var nodeSource = { id: 1, name: "a" };
        var nodeTarget = { id: 2, name: "b" };
        Graffeine.graph.addNode(nodeSource);
        Graffeine.graph.addNode(nodeTarget);
        expect(Graffeine.graph.pathCount()).toEqual(0);
        Graffeine.graph.addPath(1,2,"knows");
        expect(Graffeine.graph.pathCount()).toEqual(1);
        Graffeine.graph.addPath(2,1,"knows");
        expect(Graffeine.graph.pathCount()).toEqual(2);
        Graffeine.graph.addPath(1,2,"hears");
        expect(Graffeine.graph.pathCount()).toEqual(3);
    });

    it("should add path types", function() { 
        Graffeine.init();
        Graffeine.graph.addPathType("knows");
        Graffeine.graph.addPathType("hears");
        Graffeine.graph.addPathType("sees");
        expect(graffeineTestHelper.objectLength(Graffeine.graph.getPathTypes())).toEqual(3);
        Graffeine.graph.addPathType("knows");
        Graffeine.graph.addPathType("knows");
        Graffeine.graph.addPathType("knows");
        expect(graffeineTestHelper.objectLength(Graffeine.graph.getPathTypes())).toEqual(3);
    });

    it("should count path types", function() { 
        Graffeine.init();
        Graffeine.graph.addPathType("knows");
        Graffeine.graph.addPathType("hears");
        Graffeine.graph.addPathType("sees");
        expect(Graffeine.graph.pathTypeCount()).toEqual(3);
        Graffeine.graph.addPathType("knows");
        Graffeine.graph.addPathType("knows");
        Graffeine.graph.addPathType("knows");
        expect(Graffeine.graph.pathTypeCount()).toEqual(3);
    });

    it("should clear path types", function() { 
        Graffeine.init();
        Graffeine.graph.addPathType("knows");
        Graffeine.graph.addPathType("hears");
        Graffeine.graph.addPathType("sees");
        expect(Graffeine.graph.pathTypeCount()).toEqual(3);
        Graffeine.graph.clearPathTypes();
        expect(Graffeine.graph.pathTypeCount()).toEqual(0);
    });

    it("should empty graph", function(done) { 
        Graffeine.init();
        expect(Graffeine.graph.nodeCount()).toEqual(0);
        var data = JSON.parse(graffeineTestData.oneNode);
        console.log(Graffeine.socket());
        Graffeine.socket().$events["node-add"](data);
        Graffeine.svg.forceStop();
        expect(Graffeine.graph.nodeCount()).toEqual(1);
        Graffeine.graph.clear();
        expect(Graffeine.graph.nodeCount()).toEqual(0);
        Graffeine.graph.clear();
        done();
    });

    it("should add mixed data", function(done) { 
        Graffeine.init();
        var target = graffeineTestHelper.addTargetDomElement("graph");
        var data = JSON.parse(graffeineTestData.tenNodes);
        Graffeine.graph.addGraphData(data);
        expect(Graffeine.graph.nodeCount()).toEqual(10);
        expect(Graffeine.graph.pathCount()).toEqual(5);
        expect(Graffeine.graph.nodeTypeCount()).toEqual(8);
        expect(Graffeine.graph.pathTypeCount()).toEqual(4);
        Graffeine.graph.clear(); 
        done();
    });

});