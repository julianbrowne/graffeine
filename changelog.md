## ChangeLog

### 2014-07-20  V0.0.4

- fixed bug in model that prevented node from being deleted properly with cypher V2.0+
- fixed bug in model that couldn't find orhan nodes with cypher V2.0+
- websocket channel for new nodes renamed to node-add to keep client and server consistent
- bumped up all npm dependencies to latest versions: d3 (3.1.10), neo4j (1.1.0), node-static (0.6.9), socket.io (0.9.17)
- server doesn't stop just because a cypher query returned an error
- server errors can now be seen in the web client
- the 'find' button in the UI now wildcards to 'all' when the name field is empty
- minor css tidy

### 2014-07-18  V0.0.3

- removed dependency on 'js-yaml', reverting to json only for config files to keep it simpler and more 'nodey'
- included pull request from Ron Koren (with thanks) to update query syntax to neo4j 2.0+
- fixed css image reference error that appeared in the console log
