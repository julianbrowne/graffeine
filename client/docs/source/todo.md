
TODO
====

*   Add local mode that doesn't need a server
*   Add github detection to turn local mode on
*   Add node data editing
*   Add support for editing labels
*   Add a timer setting on the server side for how long queries are taking and report this on the client. "Last query: blah; time taken: blah"
*   Where a query returns 0 results (e.g. find all type==dog when there are none) the flash should activate with some kind of useful message
*   When adding a new node to a screen where the maximum nodes is already displayed need a better way of handling the new node after it's added
*   When neo4j is connected change status of graph.state.connected and change state back if svg.empty is called

DONE
====

*   when adding a new node with new type (e.g. dog), need to add that type to the type dropdown enum
*   if a node name field is an array then .join(' ') the elements in the visualisation
*   get graph metadata *after* connect, not before
*   on node menu replace the -> crappy arrow with a nice multi-glyph version
*   smooth force layout on start
*   Add highlight.js and ability to view node source
*   SVG on click event should remove any active popover
*   Disable new node creation when not connected to the graph db
*   select fill based on node label (or type) and choose css fill style from list
*   Add support for hyperlinks in node data
*   Pressing return in the join-nodes modal dialog closes the window and does nothing
*   When the graph loads it needs to get all relationship types, not just those of the nodes on the screen
*   Upgrade to latest neo4j and add authentication support
