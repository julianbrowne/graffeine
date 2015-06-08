
describe("Graffeine", function() { 

    beforeAll(function(done) { 
        require(["/lib/graffeine/loader.js"], function() { 
            console.log("test: loaded graffeine for spec");
            done();
        });
    });

    it("should have a Graffeine object", function() { 
        expect(Graffeine).toBeDefined();
    });

    it("should initialise", function() { 
        expect(Graffeine.init).toBeDefined();
        expect(Graffeine.socket).toBeDefined();
        console.log(window.io);
        Graffeine.init();
        var socket = Graffeine.socket()
        console.log(socket);
        expect(socket).not.toBe(null);
    });

    it("should throw error when no socket connection", function() { 
        var ioCopy = jQuery.extend(true, {}, window.io);
        window.io = undefined;
        expect(function(){ Graffeine.init(); }).toThrow();
        expect(function(){ Graffeine.init(); }).toThrow("No web socket");
        window.io = jQuery.extend(true, {}, ioCopy);
    });

});