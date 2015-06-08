
/**
 *  Handle clicks on buttons to delete rels in node menu
**/

Graffeine.eventHandler.prototype.deleteRelButtonClick = function(source, target, name) { 
    Graffeine.command.send('path-delete', { source: source, target: target, name: name});
    graph.ui.hideNodeMenu();
};
