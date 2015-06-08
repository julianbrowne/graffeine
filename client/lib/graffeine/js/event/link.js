/**
 *  Handle mouse-over on link/relation
**/

Graffeine.eventHandler.prototype.linkMouseover = function() { 
    return function(d, i) { 
        graph.debugMesg("(linkMouseover) processing");
    };
};

/**
 *  Handler mouse-out on paths
**/

Graffeine.eventHandler.prototype.linkMouseout = function() { 
    return function(d, i) { 
        graph.debugMesg("(linkMouseout) processing");
    };
};

/**
 *  Handle right-clicks on paths
**/

Graffeine.eventHandler.prototype.linkRightClick = function() { 
    return function(d, i) { 
        graph.debugMesg("(linkRightClick) processing");
        d3.event.stopPropagation();
        d3.event.preventDefault();
        graph.refs.force.stop();
    };
};
