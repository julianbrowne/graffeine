### Graffeine Configuration

You can just start Graffeine with an empty graph database and start adding and joining nodes, so this section is only if you want to customise the display to suit your own requirements. There are quite a few configuration options but they should default to useful enough values to get started.

As far as client-side configuration goes there's not much that can be done. These are the files of interest:

    {graffeine_home}/public/assets/javascripts/graffeine.conf.js

This file holds a few basic variables controlling the width of the graph nodes, the forces that repel them, length of relationship markers etc. The width and height of the svg graph area is also in here.
    
    {graffeine_home}/public/assets/stylesheets/graffeine.css

Contains styling for general UI features.

    {graffeine_home}/public/assets/javascripts/graph.css

Contains styling for graph-specific features (circles, labels, relationships etc).

Note that it's possible to configure the look and feel of graph nodes on the server side as they are extracted from Neo4J. If this is enabled in the server config file then graph.css will be ignored unless an !important is placed after each setting. It's best to stick to one or the other.

A rendered graph node appears in the SVG as a ```circle.node``` element with the node type as its CSS class (i.e.person or car, or the name tag used for the node: actor, title, prop in the case of the Dr Who graph). e.g. ```circle.node.person```.

On the server side all configuration is in the directory ```{graffeine_home}/conf```. There are just 3 important files here:

    {graffeine_home}/conf/server.json

Holds the node.js server info (just port, default 8004, for now). This is where the browser needs to connect to.

    {graffeine_home}/conf/neo4j.json

Holds the host and port for connecting to the appropriate Neo4J instance

    {graffeine_home}/conf/graph.json

Has three main sections: graph, nodes and rels

    graph.nameFields (list)

Fields to look for in Neo4J nodes to use as text labels in the UI. Graffeine will search for all those specified until it finds a match.
    
    graph.typeFields (list)

Fields to look for in Neo4J nodes to use as the "type" in the UI. Graffeine will search for all those specified until it finds a match. Types are not important other than for styling - as nodes are marked with a CSS class containing the type it means all nodes denoting people, for example, can be coloured differently to those of cars. By default all nodes have a type of 'default'.
    
    graph.useNameAsType (true|false)

Some graphs don't have anything approximating to a type field. There are two choices in this case (1) leave the type as 'default' or (2) tell Graffeine to use the field key used for the name as the type (as explained in the Rose Tyler example above).

![ScreenShot](https://raw.github.com/julianbrowne/graffeine/client/images/screenshot-styled.jpeg)

    graph.useCssStyle (true|false)

Style can either be set on the server side (false) or on the client using CSS (true). If using CSS then the rest of the config file can be ignored. For server side config then the following settings are relevant:

    nodes:
        default:                    # these settings apply to all nodes unless over-ridden below
        icon: ''                   # textual icon to use for node
        style:                      # all fields in style map to css (camelCase to camel-case format)
            fill: '#37FFA9'         # background colour of this node type
            strokeWidth: '1px'      # width of the line around svg circle
            stroke: '#002636'       # colour of the line around the svg circle
        label:
            fill: '#000000'         # font colour of the text label for this node

Then any of these can be overridden, for example:

        person:
            icon: ''               # icon for nodes/person
            style:
                fill: '#16a085'
