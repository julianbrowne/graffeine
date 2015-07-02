
## TODO

*   BUG: Drag feature doesn't work
*   Walk through all console.log statements and remove or refactor to util.log
*   When adding a new node to a screen where the maximum nodes is already displayed need a better way of handling the new node after it's added
*   all IIFE to refer to G rather than Graffeine
*   Documentation update
*   Move documentation to WIKI
*   Clean up all dom element selectors, matching .html to .js references and making consistent use of "#blah" and "blah" using extra util functions where necessary
*   Server side - change all references to "data" to "properties" and make sure client side matches in commands
*   Server side - command receivers should error and log if they don't get correct data elements
*   Debug output of queries to use supplant to render accurate query string

## DONE

*   when adding a new node with new type (e.g. dog), need to add that type to the type dropdown enum
*   if a node name field is an array then .join(' ') the elements in the visualisation
*   get graph metadata *after* connect, not before
*   on node menu replace the -> crappy arrow with a nice multi-glyph version
*   smooth force layout on start
*   Remove all css/styling from server side 
*   Add highlight.js and ability to view node source
*   No labels alone (except maybe as stats)
*   SVG on click event should remove any active popover
*   remove the underscore.js dependency
*   Disable new node creation when not connected to the graph db
*   select fill based on node label (or type) and choose css fill style from list
*   Add support for hyperlinks in node data
*   Pressing return in the join-nodes modal dialog closes the window and does nothing
*   When the graph loads it needs to get all relationship types, not just those of the nodes on the screen
*   Upgrade to latest neo4j and add authentication support
*   Add node data editing
*   All db queries to use the query/param object style
*   Add a timer setting on the server side for how long queries are taking and report this on the client
*   Where a query returns 0 results the client flash should show some kind of useful message
*   Add support for editing labels
*   When neo4j is connected change status of graph.state.connected

## NEXT VERSION

*   Add local mode that doesn't need a server
*   Add github detection to turn local mode on

