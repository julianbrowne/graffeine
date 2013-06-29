
#Graffeine

Caffeinated Neo4J graph exploration

![ScreenShot](https://raw.github.com/julianbrowne/graffeine-build/master/doc/config/images/screenshot-drwho.jpeg)

###TL;DR

Requires:

    node.js     v0.8.25
    neo4j       V1.9 | v2.0

Install:

    git clone https://github.com/julianbrowne/graffeine        // npm install graffeine (coming soon)

Run:

	node server                                                // npm start graffeine (coming soon)

Use:

    http://localhost:8004
	
###Background

Graph databases are amazing things. They should be the easiest of all persistence technologies to understand because they think like us - concepts connected together (Alice knows Bob) where the connections themselves can have meaning (Alice has known Bob since Tuesday) and yet in my experience that's actually not always the case. Graffeine was born because I didn't feel any of the other visualisation tools for Neo4J were quite simple enough. They got in the way when all I wanted to do was add a node (Alice), then another (Bob), and then feel all that graph loveliness coming through when I connected them and extended their relationships. I felt there was a missing tool that allows the easy explaining of graphs, exploring of graphs, and above all seeing them. Graffeine is an initial attempt at this. It won't ever be a suitable tool for admin tasks on production systems but it could work for small systems, spikes, demos, and generally helping spread the graph awesomeness.

###What is it?

Graffeine plugs into Neo4J and renders nodes and relationships as an interactive D3 SVG graph so you can add, edit, delete and connect nodes. It's not quite as easy as a whiteboard and a pen but it's close and all interactions are persisted in Neo4J.

You can either make a graph from scratch or browse an existing one using search and paging. You can even "fold" your graph to bring different aspects of it together on the same screen.

Nodes can be added, updated, and removed. New relationships can be made using drag and drop and existing relationships broken.

It's by no means phpmyadmin for Neo4J yet, but one day it could be (maybe).

![ScreenShot](https://raw.github.com/julianbrowne/graffeine-build/master/doc/config/images/screenshot-alice-bob.jpeg)

###Catches?

The schema-less nature of nodes and relationships in Neo4J makes it harder to model them visually without prior knowledge. Graffeine turns neo4j nodes and relationships into "GraffNodes" which have a name and a type. These fields are either from a name and type fields in the source graph or inferred from other fields. For example, Jim Webber's famous [Dr Who](https://github.com/jimwebber/neo4j-tutorial) graph does not use 'type' fields instead nodes are of the form:

	{ character: "Rose Tyler" }

This is a common situation. In fact for many graph applications using types and rigid schemas can be a bit on an anti-pattern or a smell that the model is trying to be relational in the tables and SQL sense. In this example Graffeine uses the field 'character' as the 'type' and the contents ("Rose Tyler") as the display name. To do this there's a graph.yml configuration file in the conf directory with a nameFields setting of 'character' and a swictch called useNameAsType set to true.

Types are not critical to Graffeine though, they're just useful for applying CSS to make the visualisation looks nice. Names are only important because they're used to label the SVG circles on screen.

The graph.yml file in {graffeine_home}/conf has other settings to determine which fields do what.

![ScreenShot](https://raw.github.com/julianbrowne/graffeine-build/master/doc/config/images/screenshot-draglet.jpeg)

###Ingredients

On the server:

	neo4j				(built with v1.9 and v2.0)
	node.js				(built with v0.8.25)

On the client (all bundled):

	D3					(on screen animation and interactions)
	JQuery				(ui management)
	JQuery UI			(primary for on screen dialogs)
	Underscore.JS		(condenses some of the tedious operations into readable code)
	Font Awesome 		(icons for each 'type' of node, defaults to a tag icon)

Tested on latest FF and Chrome browsers. Not sure about others.

![ScreenShot](https://raw.github.com/julianbrowne/graffeine-build/master/doc/config/images/screenshot-relationship.jpeg)

###Install and run

Fetch source off github

    git clone https://github.com/julianbrowne/graffeine.git

or  


	npm install graffeine

###Configure

(proper write-up coming soon - most of it is obvious if you rummage around the source)

Although there are a few configuration options all config files contain useful defaults to get started.

As far as client-side configuration goes there's not much that can be done. These are the files of interest:

	{graffeine_home}/public/assets/javascripts/graffeine.conf.js

Holds a few basic variables controlling the with of the graph nodes, the forces that repel them, length os relationship markers etc. The width and height of the svg graph area is also in here.
	
	{graffeine_home}/public/assets/stylesheets/graffeine.css

Styling for UI features

	{graffeine_home}/public/assets/javascripts/graph.css

Styling for graph features (circles, labels, relationships etc). Note that it's possible to configure the look and feel of graph nodes on the server side as they are extracted from Neo4J. If this is enabled in the server config file then graph.css will be ignored unless an !important is placed after each setting. It's better though to use one or the other. A rendered graph node appears in the svg as a

	circle.node

element with the node 'type' (person, car, of the name tag used for the node: actor, title, prop in the case of the Dr Who example) as a CSS class. e.g.

	circle.node.person

On the server side all configuration is in the directory

	{graffeine_home}/conf
	
There are just 3 important files here:

	{graffeine_home}/conf/server.yml

Holds the node.js server info (just port, default 8004, for now). This is where the browser needs to connect to.

	{graffeine_home}/conf/neo4j.yml

Holds the host and port for connecting to the appropriate Neo4J instance

	{graffeine_home}/conf/graph.yml

Has three main sections: graph, nodes and rels

	graph.nameFields (list)

Fields to look for in Neo4J nodes to use as text labels in the UI. Graffeine will search for all those specified until it finds a match.
	
	graph.typeFields (list)

Fields to look for in Neo4J nodes to use as the "type" in the UI. Graffeine will search for all those specified until it finds a match. Types are not important other than for styling - as nodes are marked with a CSS class containing the type it means all nodes denoting people, for example, can be coloured differently to those of cars. By default all nodes have a type of 'default'.
	
	graph.useNameAsType (true|false)

Some graphs don't have anything approximating to a type field. There are two choices in this case (1) leave the type as 'default' or (2) tell Graffeine to use the field key used for the name as the type (as explained in the Rose Tyler example above).

![ScreenShot](https://raw.github.com/julianbrowne/graffeine-build/master/doc/config/images/screenshot-styled.jpeg)

	graph.useCssStyle (true|false)

Style can either be set on the server side (false) or on the client using CSS (true). If using CSS then the rest of the config file can be ignored. For server side config then the following settings are relevant:

	nodes:
	    default:                    # these settings apply to all nodes unless over-ridden below
        icon: ''            		# textual icon to use for node
        style:                      # all fields in style map to css (camelCase to camel-case format)
            fill: '#37FFA9'         # background colour of this node type
            strokeWidth: '1px'      # width of the line around svg circle
            stroke: '#002636'       # colour of the line around the svg circle
        label:
            fill: '#000000'         # font colour of the text label for this node

Then any of these can be overridden, for example:

	    person:
    	    icon: ''        		# icon for nodes/person
        	style:
            	fill: '#16a085'

###Start

    node server

Connect browser to server port


###Menu Usage

![ScreenShot](https://raw.github.com/julianbrowne/graffeine-build/master/doc/config/images/screenshot-menu.jpeg)

**Connect** - button fetches the first few nodes from Neo4J  
**Start** | **Stop** - buttons start and stop the D3 force (animation) respectively  
**Replace** | **Update** - button toggles mode of the UI. Replace clears the UI and adds new nodes in their place. Update adds nodes from subsequent queries to the nodes already on screen. With Update you can 'fold' a graph by running two queries and bringing their results together on screen. Note that to prevent CPU melt-down there's a nodeLimit setting in graffeine.conf.js that limits how many nodes will be displayed in total. For large graphs this will be a problem. I think for later versions I'll add better paging features (follow relationships from one node in one direction).  
**Fetch** - Retrieves a node (and relations) by id or by 'feature' (right now 'orphans': nodes with no relations).  
**Find** - Retrieves a node by field (only name right now) and type (if there is one)  
**Add** - add new nodes. Only allows simple nodes right now but useful for building up graphs to play with.  
**Update** | **Delete** | **Duplicate** - As per each button. Performs the action on the currently selected node.  

![ScreenShot](https://raw.github.com/julianbrowne/graffeine-build/master/doc/config/images/screenshot-self.jpeg)

###Mouse Action

**Select Node** - click it  
**Unselect Node** - click another or anywhere in the SVG area  
**Drag Node** - click node, hold and drag about  
**See Node Relationships** - hover over node for a few seconds  
**Add relationships** - Drag the 'draglet' (small circle at the bottom of each node) onto either another node or itself (nodes can have relationships to themselves)  
**Delete Relationships** right click on a node and select which relationship to delete  
**Page/Follow Node** - double-click node marked with thick dotted line (nodes with thick dotted lines indicate more of the graph lies off screen)   

![ScreenShot](https://raw.github.com/julianbrowne/graffeine-build/master/doc/config/images/screenshot-help.jpeg)

###Help?

Yes please. This started as a lunchtime play and then grew too fast and then swamped me. I've cleaned it up in phases but the code is still really quite messy (very in some places). It needs tests, some serious refactoring (marked in a few places in the code) and quite a bit of elegance added. But it will get there eventually.

Feel free to drop me a line via julianbrowne.com with questions, features requests, suggestions, offers of help etc.
