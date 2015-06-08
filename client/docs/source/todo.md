
TODO
====

*   Add local mode that doesn't need a server
*   Add github detection to turn local mode on
*   Add node data editing
*   Add support for hyperlinks in node data
*   Add support for editing labels
*   Add a timer setting on the server side for how long queries are taking and report this on the client. "Last query: blah; time taken: blah"
*   Where a query returns 0 results (e.g. find all type==dog when there are none) the flash should activate with some kind of useful message
*   Add highlight.js and ability to view node source
*   When adding a new node to a screen where the maximum nodes is already displayed need a better way of handling the new node after it's added
*   Pressing return in the join-nodes modal dialog closes the window and does nothing
*   When the graph loads it needs to get all relationship types, not just those of the nodes on the screen
*   SVG on click event should remove any active popover
*   When neo4j is connected change status of graph.state.connected and change state back if svg.empty is called
*   When node/new is selected check to see if graph.state.connected is true and error if not

DONE
====

*   when adding a new node with new type (e.g. dog), need to add that type to the type dropdown enum
*   if a node name field is an array then .join(' ') the elements in the visualisation
*   get graph metadata *after* connect, not before
*   on node menu replace the -> crappy arrow with a nice multi-glyph version
