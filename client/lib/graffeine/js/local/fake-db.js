
var Fake = {};

Fake.db = (function() { 

    var nodeData = [ 
        { "node": "n", "id":  1, "name": "A", "data": {}, "labels": [], "type": "person" },
        { "node": "n", "id":  2, "name": "B", "data": {}, "labels": [], "type": "person" },
        { "node": "n", "id":  3, "name": "C", "data": {}, "labels": [], "type": "person" },
        { "node": "n", "id":  4, "name": "D", "data": {}, "labels": [], "type": "cat" },
        { "node": "n", "id":  5, "name": "E", "data": {}, "labels": [], "type": "dog" },
        { "node": "n", "id":  6, "name": "F", "data": {}, "labels": [], "type": "llama" },
        { "node": "n", "id":  7, "name": "G", "data": {}, "labels": [], "type": "fox" },
        { "node": "n", "id":  8, "name": "H", "data": {}, "labels": [], "type": "squirrel" },
        { "node": "n", "id":  9, "name": "I", "data": {}, "labels": [], "type": "cheese" },
        { "node": "n", "id": 10, "name": "J", "data": {}, "labels": [], "type": "beverage" }
    ];

    var pathData = [ 
        { "node": "r", "id": 11, "type": "knows", "data": {}, "start": 1, "end": 2 },
        { "node": "r", "id": 12, "type": "knows", "data": {}, "start": 4, "end": 2 },
        { "node": "r", "id": 13, "type": "sees", "data": {}, "start": 2, "end": 9 },
        { "node": "r", "id": 14, "type": "hears", "data": {}, "start": 7, "end": 4 },
        { "node": "r", "id": 15, "type": "remembers", "data": {}, "start": 10, "end": 3 }
    ];

    var nodes = {};

    var paths = [];

    function init() { 
        nodeData.forEach(function(n) { 
            var node = new Graffeine.model.Node(n);
        });
        pathData.forEach(function(p) { 
            var path = new Graffeine.model.Path(p);
        });
    };

    init();

}());