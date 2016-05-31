#!/bin/bash

SCRIPT=$0
SCRIPT=`basename "$SCRIPT"`

NODE_VERSION="`node -v`"
NODE_SERVER_PORT=8004

NEO4J_HOME="/usr/local/neo4j"
NEO4J_SERVER_PORT=7474

GRAFF_HOME="`cd $( dirname "$SCRIPT" )/.. && dirs -l +0`"

# start neo4j

neopid=$(lsof -i :${NEO4J_SERVER_PORT} -F T -Ts | grep -i "TST=LISTEN" -B1 | head -n1)
neopid=${neopid:1}

if [ ${neopid} ]
then
    echo "Neo4j already running (${neopid})"
else
    ${NEO4J_HOME}/bin/neo4j start
fi

# start node.js server

nodepid=$(lsof -i :${NODE_SERVER_PORT} -F T -Ts | grep -i "TST=LISTEN" -B1 | head -n1)
nodepid=${nodepid:1}

if [ ${nodepid} ]
then
    echo "Graffeine already running (${nodepid})"
else
    echo "Starting ${GRAFF_HOME}/server/server.js"
    node ${GRAFF_HOME}/server/server.js
fi
