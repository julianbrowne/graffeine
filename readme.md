
# Graffeine

Caffeinated Graph Exploration for Neo4J.  

Graffeine is a visually interactive client for small [Neo4J](http://neo4j.com/) graph databases.  

## Update July 2015

Stay tuned - Graffeine is having a full re-write.  

Some of the major changes include:  

-   Styling. Swapped out all the JQuery UI styling and replaced with Bootstrap. This gives a much cleaner interface that is clear in HTML terms and also much easier to extend.
-   Tests. The original suffered from a lack of them. The new version has far more.
-   Redesigned. There are now two directories:
    -   a node.js server-side component (/server)
    -   a client-side GUI (/client) that can run on it's own, which means it's easy to replace the server with another (Ruby, Java) version later. The only connection between the client and the server is an exchange of web socket messages.
-   Cleaned. All UI components are now self-contained and follow a similar (JavaScript [Module](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html)) pattern.
-   Functionality. Everything that came up in new feature requests for the old version been added.

## Dependencies

-   node.js 0.12.x or later  
-   Neo4j 2.2.x or later  
-   A very modern browser that is happy with:
    -   [D3](http://d3js.org/) 3.5.5
    -   [JQuery](http://jquery.com/) 2.1.4
    -   [Bootstrap]() 3.3.4

## Installation

If you have git installed then just clone the repository:

    git clone https://github.com/julianbrowne/graffeine

Or get the latest zip file at:

    https://github.com/julianbrowne/graffeine/releases

You should end up with a "readme.md" file and two directories ("client" and "server") in a location we'll call "{HOME}"

## Running

You should read the documentation first, but once you've done that here's what you need to do to get started:

-   Edit the file {HOME}/server/config/neo4j.json if you have Neo4J running on a port other than 7474, or if you have authentication requirements
-   Start the server from the {HOME}/server directory by typing ```node server```
-   If none of the defaults (port etc) have been changed, open your browser at ```http://localhost:8004/```

![screenshot](https://raw.githubusercontent.com/julianbrowne/graffeine/v0.1/client/docs/images/screenshot-home.jpeg)