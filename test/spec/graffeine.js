
console.log = function() {};
var graffeine = require("../../lib/graffeine");

describe("graffeine", function() { 

    it("should exist", function() { 
        expect(graffeine).toBeDefined();
    });

    it("should have a sender", function() { 
        expect(graffeine.sender).toBeDefined();
    });

    it("should have a receiver", function() { 
        expect(graffeine.receiver).toBeDefined();
    });

    it("should have an event manager", function() { 
        expect(graffeine.eventManager).toBeDefined();
        expect(graffeine.eventManager).toEqual(jasmine.any(Function));
        var socket = { on: function(){} };
        var event = graffeine.eventManager(socket);
        expect(event).toBeDefined();
        expect(event.on).toBeDefined();
    });

    it("should catch event wiring to nonexistent functions", function() { 
        spyOn(process, 'exit');
        var socket = { on: function(){} };
        var event = graffeine.eventManager(socket);
        event.on("my-event", undefined);
        expect(process.exit).toHaveBeenCalledWith(-1);
    });

});
