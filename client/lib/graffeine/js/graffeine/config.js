define({ 
    "root": "/lib/graffeine/",
    "graphSettings": { 
        "width":               1200,  // width of the graph UI display
        "height":               800,  // height of the graph UI display
        "nodeLimit":             50,  // Max nodes to display in UI
        "circleRadius":          45,  // Radius of circles (nodes)
        "linkDistance":         250,  // Distance between circles (nodes)
        "charge":             -1200   // node repel charge
    },
    "core": { 
        "host": "http://127.0.0.1"   // where the node.js server be at
    }
});
