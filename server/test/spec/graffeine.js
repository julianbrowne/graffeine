
console.log = function() {};
var graffeine = require("../../lib/graffeine");

describe('graffeine', function() { 

    it('should exist', function() { 
        expect(graffeine).toBeDefined();
    });

    it('should have a command function', function() { 
        expect(graffeine.command).toBeDefined();
    });

    it('should have an event manager', function() { 
        expect(graffeine.eventManager).toBeDefined();
        expect(graffeine.eventManager).toEqual(jasmine.any(Function));
        var socket = { on: function(){} };
        var event = graffeine.eventManager(socket);
        expect(event).toBeDefined();
        expect(event.on).toBeDefined();
    });

});