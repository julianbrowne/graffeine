
# Change Log

## V0.3

Supports Neo4J V2.x and V3.x

### Styling

Swapped out all the JQuery UI styling and replaced with Bootstrap. This gives a much cleaner interface that is clear in HTML terms and also much easier to extend.

### Tests

V0.1 suffered from a lack of them. The new version has far more.

### Redesign

There are now two directories: _server_ and _client_
    -   a node.js server-side component
    -   a JS client-side GUI

The client can run on it's own, which means it's easy to replace the server with another (Ruby, Java) version later. The only connection between the client and the server is an exchange of web socket messages.

All UI components are now self-contained and follow a similar (JavaScript [Module](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html)) pattern.

### Functionality

Everything that came up in new feature requests for V0.1 has been added.
