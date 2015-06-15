
describe("Command", function() { 

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

    it("should have a socket defined", function() { 
        expect(Graffeine.socket).toBeDefined();
    });

    it("should send a command message", function() { 
        spyOn(Graffeine.socket(), 'emit');
        Graffeine.command.send('test', {a:1});
        expect(Graffeine.socket().emit).toHaveBeenCalled();
        expect(Graffeine.socket().emit).toHaveBeenCalledWith("test", {a:1});
    });

    it("should manage a server-error message", function() { 
        var target = graffeineTestHelper.addTargetDomElement("flash");
        Graffeine.socket().$events["server-message"]({ 
            category: "error",
            title: "test",
            message: "test"
        });
        expect(target.html()).toEqual('<div class="alert alert-dismissible alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="close"><span aria-hidden="true">×</span></button><strong>test: </strong>test</div>');
        graffeineTestHelper.removeTargetDomElement(target);
    });

    it("should have all command events registered", function(done) { 
        var events = [ 
            "data-nodes",
            "node-add",
            "node-join",
            "nodes-count",
            "path-count",
            "node-delete",
            "node-update",
            "path-delete"
        ];
        events.forEach(function(e, index) { 
            expect(Graffeine.socket().$events[e]).toBeDefined();
            if(index===(events.length-1)) done();
        });
    });

    it("should manage a data-nodes message", function(done) { 
        Graffeine.init();
        var target = graffeineTestHelper.addTargetDomElement("graph");
        var data = JSON.parse(graffeineTestData.tenNodes);
        Graffeine.socket().$events["data-nodes"](data);
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

    it("should manage a node-add message", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph");
        var data = JSON.parse(graffeineTestData.oneNode);
        Graffeine.socket().$events["node-add"](data);
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

    it("should manage a node-join message", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph");
        var relationship = "knows";
        var data = JSON.parse(graffeineTestData.twoNodes);
        Graffeine.socket().$events["data-nodes"](data);
        expect($("g.paths > path").length).toEqual(0);
        Graffeine.socket().$events["node-join"]({source:1, target:2, name:relationship});
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

    it("should manage a nodes-count message", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph-stats-node-count");
        Graffeine.socket().$events["nodes-count"]({count: 99});
        expect(target.html()).toEqual("99");
        graffeineTestHelper.removeTargetDomElement(target);
        done();
    });

    it("should manage a path-count message", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph-stats-path-count");
        Graffeine.socket().$events["path-count"]({count: 99});
        expect(target.html()).toEqual("99");
        graffeineTestHelper.removeTargetDomElement(target);
        done();
    });


    it("should manage a node-delete message", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph");
        var data = JSON.parse(graffeineTestData.twoNodes);
        Graffeine.socket().$events["data-nodes"](data);
        Graffeine.svg.forceStop();
        expect($("g.nodes > circle").length).toEqual(2);
        Graffeine.socket().$events["node-delete"]({id:1});
        expect($("g.nodes > circle").length).toEqual(1);
        Graffeine.graph.clear();
        done();
    });

    it("should manage a node-update message", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph");
        var nodeData = JSON.parse(graffeineTestData.oneNode);
        Graffeine.socket().$events["node-add"](nodeData);
        Graffeine.svg.forceStop();
        expect($("g.nodes > circle").length).toEqual(1);
        var node = $("g.node-labels text");
        nodeData.node.name = "updated name";
        var nodeUpdateData = { 
            node: nodeData, 
            updatedAt: new Date().getTime()
        };
        Graffeine.socket().$events["node-update"](nodeUpdateData);
        Graffeine.graph.clear();
        done();
    });

    it("should manage a path-delete message", function(done) { 
        var target = graffeineTestHelper.addTargetDomElement("graph");
        var data = JSON.parse(graffeineTestData.tenNodes);
        Graffeine.socket().$events["data-nodes"](data);
        Graffeine.svg.forceStop();
        expect($("g.nodes > circle").length).toEqual(10);
        expect($("g.paths > path").length).toEqual(5);
        Graffeine.socket().$events["path-delete"]({ source: 4, target: 2, name: "knows" });
        expect($("g.nodes > circle").length).toEqual(10);
        expect($("g.paths > path").length).toEqual(4);
        //Graffeine.graph.clear();
        done();
    });

});