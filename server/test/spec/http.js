
console.log = function() {};
var http = require("../../lib/listener/http");

describe('http', function() { 

    it('should exist', function() { 
        expect(http).toBeDefined();
    });

    it('should have a listener', function() { 
        expect(http.listener).toBeDefined();
    });

});