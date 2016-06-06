
var utils = require("../../lib/models/utils");

describe('model-utils', function() { 

    it('should exist', function() { 
        expect(utils).toBeDefined();
    });

    it('should extract JSON properties usable by neo4j', function() { 
        expect(utils.extractProperties(undefined)).toEqual({});
        expect(utils.extractProperties(null)).toEqual({});
        expect(utils.extractProperties({})).toEqual({});
        expect(utils.extractProperties({data: {"name":"my-name", "age":42}})).toEqual({name:"my-name", age:42});
    });

});
