
describe("Command", function() { 

    beforeAll(function(done) { 
        require(["/lib/graffeine/loader.js"], function() { 
            console.log("test: loaded graffeine for spec");
            Graffeine.init();
            spyOn(Graffeine.command, 'send').and.returnValue(true);
            done();
        });
    });

    it("should have a Graffeine object", function() { 
        expect(Graffeine).toBeDefined();
    });

    it("should have a socket defined", function() { 
        expect(Graffeine.socket).toBeDefined();
    });

    it("should send a command message", function() { 
        Graffeine.command.send('test', {a:1});
        expect(Graffeine.command.send).toHaveBeenCalled();
        expect(Graffeine.command.send).toHaveBeenCalledWith("test", {a:1});
    });

    it("should manage a Server Information message", function() { 
        var target = graffeineTestHelper.addTargetDomElement("flash");
        var serverMessage = graffeineTestHelper.getSocketEventCallback("server:info");
        serverMessage({ category: "error", title: "test", message: "test" });
        expect(target.find("div.alert").length).toEqual(1);
        expect(target.find("button").length).toEqual(1);
        graffeineTestHelper.removeTargetDomElement(target);
    });

    it("should have all server command events registered", function() { 
        expect(Graffeine.socket()._callbacks["server:info"]).toBeDefined();
        expect(Graffeine.socket()._callbacks["graph:nodes"]).toBeDefined();
        expect(Graffeine.socket()._callbacks["nodes:add"]).toBeDefined();
        expect(Graffeine.socket()._callbacks["nodes:count"]).toBeDefined();
        expect(Graffeine.socket()._callbacks["nodes:remove"]).toBeDefined();
        expect(Graffeine.socket()._callbacks["nodes:update"]).toBeDefined();
        expect(Graffeine.socket()._callbacks["paths:add"]).toBeDefined();
        expect(Graffeine.socket()._callbacks["paths:count"]).toBeDefined();
        expect(Graffeine.socket()._callbacks["paths:remove"]).toBeDefined();
    });

    it("should manage a Graph Nodes message", function(done) { 
        Graffeine.init();
        var target = graffeineTestHelper.addTargetDomElement("graph");
        var data = JSON.parse(graffeineTestData.tenNodes);
        var dataNodes = graffeineTestHelper.getSocketEventCallback("graph:nodes");
        dataNodes(data);
        Graffeine.svg.forceStop();
        var nodes = Graffeine.graph.nodes();
        expect(Object.keys(nodes).length).toEqual(10);
        expect($("g.nodes > circle").length).toEqual(10);
        expect($("g.draglets > circle").length).toEqual(10);
        expect($("g.node-labels > text").length).toEqual(10);
        expect($("g.node-icons").children().length).toEqual(10);
        expect($("g.paths > path").length).toEqual(5);
        Graffeine.graph.clear();
        done();
    });

    it("should manage a Node Add message", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph");
        var data = JSON.parse(graffeineTestData.oneNode);
        var nodeAdd = graffeineTestHelper.getSocketEventCallback("nodes:add");
        nodeAdd(data);
        Graffeine.svg.forceStop();
        var c = $("g.nodes > circle");
        expect($("g.nodes > circle").length).toEqual(1);
        expect($("g.draglets > circle").length).toEqual(1);
        expect($("g.node-labels > text").length).toEqual(1);
        expect($("g.node-icons").children().length).toEqual(1);
        expect($("g.paths > path").length).toEqual(0);
        Graffeine.graph.clear();
        done();
    });

    it("should manage a Paths Add message", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph");
        var relationship = "knows";
        var data = JSON.parse(graffeineTestData.twoNodes);
        var dataNodes = graffeineTestHelper.getSocketEventCallback("graph:nodes");
        dataNodes(data);
        expect($("g.paths > path").length).toEqual(0);
        var nodeJoin = graffeineTestHelper.getSocketEventCallback("paths:add");
        nodeJoin({source:1, target:2, name:relationship});
        Graffeine.svg.forceStop();
        expect($("g.nodes > circle").length).toEqual(2);
        expect($("g.draglets > circle").length).toEqual(2);
        expect($("g.node-labels > text").length).toEqual(2);
        expect($("g.node-icons").children().length).toEqual(2);
        expect($("g.paths > path").length).toEqual(1);
        expect($("g.paths > path").attr("class")).toContain(relationship);
        Graffeine.graph.clear();
        done();
    });

    it("should manage a Nodes Count message", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph-stats-node-count");
        var nodesCount = graffeineTestHelper.getSocketEventCallback("nodes:count");
        nodesCount({count: 99});
        expect(target.html()).toEqual("99");
        graffeineTestHelper.removeTargetDomElement(target);
        done();
    });

    it("should manage a Paths Count message", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph-stats-path-count");
        var pathCount = graffeineTestHelper.getSocketEventCallback("paths:count");
        pathCount({count: 99});
        expect(target.html()).toEqual("99");
        graffeineTestHelper.removeTargetDomElement(target);
        done();
    });


    it("should manage a Node Remove message", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph");
        var data = JSON.parse(graffeineTestData.twoNodes);
        var dataNodes = graffeineTestHelper.getSocketEventCallback("graph:nodes");
        dataNodes(data);
        Graffeine.svg.forceStop();
        expect($("g.nodes > circle").length).toEqual(2);
        var nodeDelete = graffeineTestHelper.getSocketEventCallback("nodes:remove");
        nodeDelete({id:1});
        expect($("g.nodes > circle").length).toEqual(1);
        Graffeine.graph.clear();
        done();
    });

    it("should manage a Nodes Update message", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph");
        var nodeData = JSON.parse(graffeineTestData.oneNode);
        var nodeAdd = graffeineTestHelper.getSocketEventCallback("nodes:add");
        nodeAdd(nodeData);
        Graffeine.svg.forceStop();
        expect($("g.nodes > circle").length).toEqual(1);
        var node = $("g.node-labels text");
        nodeData.node.name = "updated name";
        var nodeUpdateData = { 
            node: nodeData, 
            updatedAt: new Date().getTime()
        };
        var nodeUpdate = graffeineTestHelper.getSocketEventCallback("nodes:update");
        nodeUpdate(nodeUpdateData);
        Graffeine.graph.clear();
        done();
    });

    it("should manage a Paths Remove message", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph");
        var data = JSON.parse(graffeineTestData.tenNodes);
        var dataNodes = graffeineTestHelper.getSocketEventCallback("graph:nodes");
        dataNodes(data);
        Graffeine.svg.forceStop();
        expect($("g.nodes > circle").length).toEqual(10);
        expect($("g.paths > path").length).toEqual(5);
        var pathDelete = graffeineTestHelper.getSocketEventCallback("paths:remove");
        pathDelete({ source: 4, target: 2, name: "knows" });
        expect($("g.nodes > circle").length).toEqual(10);
        expect($("g.paths > path").length).toEqual(4);
        //Graffeine.graph.clear();
        done();
    });

});