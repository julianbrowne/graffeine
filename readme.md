
# Graffeine

Caffeinated Graph Exploration for Neo4J.  

Graffeine is a visually interactive client for small [Neo4J](http://neo4j.com/) graph databases.  

See [change log](changes.md)

## Dependencies

*   node.js 0.12.x or later  
*   Neo4j 2.2.x or later  
*   A very modern browser that is happy with:
    -   [D3](http://d3js.org/) 3.5.17
    -   [JQuery](http://jquery.com/) 2.1.4
    -   [Bootstrap]() 3.3.4

## Install

If you have git installed then just clone the repository:

    git clone https://github.com/julianbrowne/graffeine

Or get the latest zip file at:

    https://github.com/julianbrowne/graffeine/releases

You should end up with a "readme.md" file and two directories (``client`` and ``server``)

## Run

To use all the defaults and start everything (neo4j and the graffeine server) there's a shell script in ``server``

    start.sh

That starts neo4j on the default port of 7474 and the graffeine server on 8004.  
Open your browser at ``http://localhost:8004/`` to get started

### Configuration

-   Edit the file {HOME}/server/config/neo4j.json if you have Neo4J running on a port other than 7474, or if you have authentication requirements
-   Start the server from the {HOME}/server directory by typing ``node server``
-   If none of the defaults (port etc) have been changed, 

![screenshot](https://raw.githubusercontent.com/julianbrowne/graffeine/v0.1/client/docs/images/screenshot-home.jpeg)