### User Guide

![ScreenShot](https://raw.github.com/julianbrowne/graffeine/client/images/screenshot-menu.jpeg)

**Connect** - button fetches the first few nodes from Neo4J  
**Start** | **Stop** - buttons start and stop the D3 force (animation) respectively  
**Replace** | **Update** - button toggles mode of the UI. Replace clears the UI and adds new nodes in their place. Update adds nodes from subsequent queries to the nodes already on screen. With Update you can 'fold' a graph by running two queries and bringing their results together on screen. Note that to prevent CPU melt-down there's a nodeLimit setting in graffeine.conf.js that limits how many nodes will be displayed in total. For large graphs this will be a problem. I think for later versions I'll add better paging features (follow relationships from one node in one direction).  
**Fetch** - Retrieves a node (and relations) by id or by 'feature' (right now 'orphans': nodes with no relations).  
**Find** - Retrieves a node by field (only name right now) and type (if there is one)  
**Add** - add new nodes. Only allows simple nodes right now but useful for building up graphs to play with.  
**Update** | **Delete** | **Duplicate** - As per each button. Performs the action on the currently selected node.  

![ScreenShot](https://raw.github.com/julianbrowne/graffeine/client/images/screenshot-self.jpeg)

### Mouse Action

**Select Node** - click it  
**Unselect Node** - click another or anywhere in the SVG area  
**Drag Node** - click node, hold and drag about  
**See Node Relationships** - hover over node for a few seconds  
**Add relationships** - Drag the 'draglet' (small circle at the bottom of each node) onto either another node or itself (nodes can have relationships to themselves)  
**Delete Relationships** right click on a node and select which relationship to delete  
**Page/Follow Node** - double-click node marked with thick dotted line (nodes with thick dotted lines indicate more of the graph lies off screen)   

![ScreenShot](https://raw.github.com/julianbrowne/graffeine/client/images/screenshot-help.jpeg)