
describe("UI Stats", function() { 

    beforeAll(function(done) { 
        require(["/lib/graffeine/loader.js"], function() { 
            console.log("test: loaded graffeine for spec");
            done();
        });
    });

    it("should have a Graffeine object", function() { 
        expect(Graffeine).toBeDefined();
    });

    it("should be defined", function() { 
        expect(Graffeine.ui.graphStats).toBeDefined();
    });

    it("should record node count", function() { 
        var target = graffeineTestHelper.addTargetDomElement("graph-stats-node-count");
        Graffeine.ui.graphStats.update("nodeCount", 12345);
        expect($("#graph-stats-node-count").html()).toEqual("12345");
        graffeineTestHelper.removeTargetDomElement(target);
    });

    it("should record path count", function() { 
        var target = graffeineTestHelper.addTargetDomElement("graph-stats-path-count");
        Graffeine.ui.graphStats.update("pathCount", 54321);
        expect($("#graph-stats-path-count").html()).toEqual("54321");
        graffeineTestHelper.removeTargetDomElement(target);
    });
});
