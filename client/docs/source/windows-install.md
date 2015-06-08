
# Installing Graffeine on Windows

This install will put graffeine in c:\graffeine

![install directory](images/2014-10-14_101104.png)

## Install Java

Download latest Java for windows from:

	https://java.com/en/download/index.jsp

Run the ``jxpiinstall.exe``

Might want to skip setting Ask as the default search engine etc.

Ignore any suggestions to ernable applets in the control panel. Once the install finsihes you are done.

Prove that Java is available by running:

	java -version

at the command line. Neo4J requires V1.7 SDK or later.

## Install Neo4J

Download latest Neo4J from:

	http://neo4j.com/download/

Run the executable which will be something like ``neo4j-community_windows_2_1_5.exe``

Accept license agreements, etc.

Select start the server and choose a location for the data:

![data location](images/2014-10-14_102339.png)

You may get a complaint from windows firewall. If so select 'allow access'

Once server is running, you see the URL for the admin interface:

![admin interface](images/2014-10-14_102631.png)

Open the browser at that address and try a basic query:

![cypher](images/2014-10-14_102746.png)

you'll get zero matches because the database is empty, but this indiactes Neo4J is ready for action.

## Install Node.js

Download node.js from:

	http://nodejs.org/download/

Select the appropriate installer for your operating system.

Run the installer (e.g. ``node-v0.10.32-x64.msi``)

Accept the terms and defaults etc.

Once complete in a new command line (so windows knows the path to the newly installed executable), check the node version:

![node version](images/2014-10-14_104215.png)

## Install Graffeine

Move to a useful directory that already exists:

	cd \graffeine

Simply run:

	npm install graffeine
	
note: if windows complains about an ``Error: ENOENT, stat`` for the npm directory in the user's home then just manually make it:

	md %HOMEPATH%\AppData\Roaming\npm

The package will be installed in the node_modules subdirectory:

![npm package](images/2014-10-14_105421.png)

## Running Graffeine

The simplest way to start graffeine is just to type:

	npm start graffeine
	
![start graffeine](images/2014-10-14_105552.png)

**ctrl+c** will stop the graffeine server

By default the server runs on locahost:8004 so open a browser at ``http://127.0.0.1:8004``

![graffeine host](images/2014-10-14_105804.png)

This screen is empty because graffeine has not yet connected to neo4j, click the orange 'connect' button:

![graffeine connected](images/2014-10-14_105813.png)

and you have the equivilent of the ``match n return n`` from earlier.

To add a node, fill in the fields in the add section on the toolbar:

![add node 1](images/2014-10-14_110039.png)

and the node should appear in the console:

![new node 1](images/2014-10-14_110157.png)

add another node:

![add node 2](images/2014-10-14_110247.png)

![new node 2](images/2014-10-14_110312.png)

connect them with a relationship:

![connect 2](images/2014-10-14_110432.png)

![connect 2](images/2014-10-14_110524.png)

The rest can be found in the user guide.

![connected nodes](images/2014-10-14_110616.png)
