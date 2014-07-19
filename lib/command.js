
var graffeine = require('./common');
var util      = require('util');
var model     = require('./models/all');

var Command = { 

    Server: function(socket) { 

        this.socket = socket;

        this.graphInitialise = function(data) { 
            graffeine.log('RECV: graph-init -> : ' + util.inspect(data));
            model.graph.all(function(nodes) {
                graffeine.log('SEND: graph-init -> : ' + nodes.length + ' nodes sent');
                socket.emit('data-nodes', {
                    nodes: nodes,
                    count: nodes.length,
                    updatedAt: new Date().getTime()
                });
            });
        },

        this.graphStatistics = function(data) {
            graffeine.log('RECV: graph-stats -> : ' + util.inspect(data));
            model.nodes.count(function(count) {
                graffeine.log('SEND: nodes-count -> : ' + count);
                socket.emit('nodes-count', {
                    count: count,
                    updatedAt: new Date().getTime()
                });
            });
            model.rels.count(function(count) {
                graffeine.log('SEND: rels-count -> : ' + count);
                socket.emit('rels-count', {
                    count: count,
                    updatedAt: new Date().getTime()
                });
            });
        },

        this.nodesOrphans = function(data) {
            graffeine.log('RECV: nodes-orphans -> : ' + util.inspect(data));
            model.nodes.orphans(function(nodes) {
                socket.emit('data-nodes', { nodes: nodes, updatedAt: new Date().getTime() } );
            });
        },

        this.graphFetch = function(data) {
            graffeine.log('RECV: graph-fetch -> : ' + util.inspect(data));
            model.nodes.from(data.start, function(nodes) {
                graffeine.log('SEND: graph-fetch -> : ' + nodes);
                nodes.forEach(function(node) {
                    graffeine.log('SEND: graph-fetch -> : ' + node);
                });
                socket.emit('data-nodes', { nodes: nodes, root: data.start, updatedAt: new Date().getTime() } );
            });
        },

        this.nodesJoin = function(data) {
            graffeine.log('RECV: node-join -> : ' + util.inspect(data));
            model.nodes.join(data.source, data.target, data.rel, function(success) {
                if(success) {
                    graffeine.log('SEND: node-join ->');
                    socket.emit('node-join', { source: data.source, target: data.target, rel: data.rel, updatedAt: new Date().getTime() } );
                }
                else {
                     graffeine.log('FAIL: node-join -> ' + util.inspect(data));
                }
            });
        },

        this.nodeAdd = function(data) { 
            graffeine.log('RECV : node-add -> ' + util.inspect(data));
            model.nodes.add(data, function(node) { 
                graffeine.log('SEND: node-add -> : ' + util.inspect(node));
                socket.emit('node-add', { node: node, updatedAt: new Date().getTime() } );
            });
        },

        this.nodeDelete = function(data) { 
            graffeine.log('RECV : node-delete -> ' + util.inspect(data));
            model.nodes.delete(data.id, function(result) {
                graffeine.log('SEND: node-delete -> : ' + util.inspect(result));
                socket.emit('node-delete', { id: data.id, updatedAt: new Date().getTime() } );
            });
        },

        this.nodeFind = function(data) {
            graffeine.log('RECV : node-find -> ' + util.inspect(data));
            model.nodes.find(data.name, data.type, function(nodes) {
                graffeine.log('FIND : node(s) found -> ' + nodes.length);
                if(nodes.length > 0) {
                    var ids = [];
                    for(var i=0; i<nodes.length; i++) {
                        ids.push(nodes[i].id);
                    }
                    model.nodes.from(ids.join(), function(nodes) {
                        graffeine.log('SEND: data-nodes -> : ' + nodes.length);
                        socket.emit('data-nodes', { nodes: nodes, updatedAt: new Date().getTime() } );
                    });
                }
            });
        },

        this.nodeUpdate = function(data) {
            graffeine.log('RECV : node-update -> ' + util.inspect(data));
            model.nodes.update(data.id, data.data, function(result) {
                graffeine.log('SEND: node-update -> : ' + data.id);
                socket.emit('node-update', { id: data.id, data: result, updatedAt: new Date().getTime() } );
            });
        },

        this.relDelete = function(data) {
            graffeine.log('RECV : rel-delete -> ' + util.inspect(data));
            model.rels.delete(data.source, data.target, data.rel, function(success) {
                if(success) { 
                    graffeine.log('SEND: rel-delete -> ');
                    socket.emit('rel-delete', { source: data.source, target: data.target, rel: data.rel, updatedAt: new Date().getTime() } );
                }
                else { 
                    graffeine.log('FAIL: rel-delete -> ' + util.inspect(data));
                }
            });
        }
    }
}

module.exports = Command.Server
