
describe("Graffeine config", function() { 

    beforeAll(function(done) { 
        require(["/lib/graffeine/loader.js"], function() { 
            console.log("test: loaded graffeine for spec");
            done();
        });
    });

    it("should have a Graffeine object", function() { 
        expect(Graffeine).toBeDefined();
    });

    it("should have a root path", function() { 
        expect(Graffeine.config.root).toBeDefined();
    });

    it("should have graph settings", function() { 
        expect(Graffeine.config.graphSettings).toBeDefined();
    });

    it("should have a server host set", function() { 
        expect(Graffeine.config.core.host).toBeDefined();
    });

});