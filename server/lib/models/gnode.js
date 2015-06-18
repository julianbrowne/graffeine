
var gutil = require("../gutil");

module.exports = function(neoNode) { 
        var neoType = neoNode.node;
        var graffNode = {};
        graffNode.data   = neoNode.properties || {};
        graffNode.id     = neoNode._id;
        graffNode.self   = neoNode.self;
        graffNode.exists = neoNode.exists;
        graffNode.labels = neoNode.labels;
        if(neoType === 'r') { 
            graffNode.node = 'r';
            graffNode.type = neoNode.type;
            graffNode.start = neoNode._fromId;
            graffNode.end = neoNode._toId;
            return graffNode;
        }
        if(neoType === 'n' || neoType === 'm') { 
            graffNode.node   = 'n';
            return graffNode;
        }
        gutil.die("gnode: unknown node type: %s", neoType);
};