
var graph = require("../src/server/conf/graph.json");
var neo4j = require("../src/server/conf/neo4j.json");
var servr = require("../src/server/conf/server.json");

describe('Graph configuration', function () { 

    it('should contain the right number of sections', function () { 
        expect(Object.keys(graph).length).toEqual(3);
    });

    it('should contain the correct sections', function () { 
        expect(graph.hasOwnProperty('graph')).toBe(true);
        expect(graph.hasOwnProperty('nodes')).toBe(true);
        expect(graph.hasOwnProperty('rels')).toBe(true);
    });

});

describe('Neo4J configuration', function () { 

    it('should contain the right number of sections', function () { 
        expect(Object.keys(neo4j).length).toEqual(1);
    });

    it('should contain the correct sections', function () { 
        expect(neo4j.hasOwnProperty('neo4j')).toBe(true);
        expect(neo4j.neo4j.hasOwnProperty('host')).toBe(true);
        expect(neo4j.neo4j.hasOwnProperty('port')).toBe(true);
        expect(neo4j.neo4j.port).toEqual(jasmine.any(Number));
    });

});

describe('Server configuration', function () { 

    it('should contain the right number of sections', function () { 
        expect(Object.keys(servr).length).toEqual(2);
    });

    it('should contain the correct sections', function () { 
        expect(servr.hasOwnProperty('nodejs')).toBe(true);
        expect(servr.nodejs.hasOwnProperty('port')).toBe(true);
        expect(servr.nodejs.port).toEqual(jasmine.any(Number));
        expect(servr.hasOwnProperty('debug')).toBe(true);
    });

});
