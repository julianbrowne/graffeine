
var g    = require('./common');
var util = require('util');
var m    = require('./models/models');

var Command = {

    Server: function(socket) {

        this.graphInitialise = function(data) {
            g.log('RECV: graph-init -> : ' + util.inspect(data));
            m.graph.all(function(nodes) {
                g.log('SEND: graph-init -> : ' + nodes.length + ' nodes sent');
                socket.emit('data-nodes', {
                    nodes: nodes,
                    count: nodes.length,
                    updatedAt: new Date().getTime()
                });
            });
        },

        this.graphStatistics = function(data) {
            g.log('RECV: graph-stats -> : ' + util.inspect(data));
            m.nodes.count(function(count) {
                g.log('SEND: nodes-count -> : ' + count);
                socket.emit('nodes-count', {
                    count: count,
                    updatedAt: new Date().getTime()
                });
            });
            m.rels.count(function(count) {
                g.log('SEND: rels-count -> : ' + count);
                socket.emit('rels-count', {
                    count: count,
                    updatedAt: new Date().getTime()
                });
            });
        },

        this.nodesOrphans = function(data) {
            g.log('RECV: nodes-orphans -> : ' + util.inspect(data));
            m.nodes.orphans(function(nodes) {
                socket.emit('data-nodes', { nodes: nodes, updatedAt: new Date().getTime() } );
            });
        },

        this.graphFetch = function(data) {
            g.log('RECV: graph-fetch -> : ' + util.inspect(data));
            m.nodes.from(data.start, function(nodes) {
                g.log('SEND: graph-fetch -> : ' + nodes);
                nodes.forEach(function(node) {
                    g.log('SEND: graph-fetch -> : ' + node);
                });
                socket.emit('data-nodes', { nodes: nodes, root: data.start, updatedAt: new Date().getTime() } );
            });
        },

        this.nodesJoin = function(data) {
            g.log('RECV: node-join -> : ' + util.inspect(data));
            m.nodes.join(data.source, data.target, data.rel, function(success) {
                if(success) {
                    g.log('SEND: node-join ->');
                    socket.emit('node-join', { source: data.source, target: data.target, rel: data.rel, updatedAt: new Date().getTime() } );
                }
                else {
                     g.log('FAIL: node-join -> ' + util.inspect(data));
                }
            });
        },

        this.nodeAdd = function(data) {
            g.log('RECV : node-add -> ' + util.inspect(data));
            m.nodes.add(data, function(node) {
                g.log('SEND: node-add -> : ' + util.inspect(node));
                socket.emit('node-new', { node: node, updatedAt: new Date().getTime() } );
            });
        },

        this.nodeDelete = function(data) {
            g.log('RECV : node-delete -> ' + util.inspect(data));
            m.nodes.delete(data.id, function(result) {
                g.log('SEND: node-delete -> : ' + util.inspect(result));
                socket.emit('node-delete', { id: data.id, updatedAt: new Date().getTime() } );
            });
        },

        this.nodeFind = function(data) {
            g.log('RECV : node-find -> ' + util.inspect(data));
            m.nodes.find(data.name, data.type, function(nodes) {
                g.log('FIND : node(s) found -> ' + nodes.length);
                if(nodes.length > 0) {
                    var ids = [];
                    for(var i=0; i<nodes.length; i++) {
                        ids.push(nodes[i].id);
                    }
                    m.nodes.from(ids.join(), function(nodes) {
                        g.log('SEND: data-nodes -> : ' + nodes.length);
                        socket.emit('data-nodes', { nodes: nodes, updatedAt: new Date().getTime() } );
                    });
                }
            });
        },

        this.nodeUpdate = function(data) {
            g.log('RECV : node-update -> ' + util.inspect(data));
            m.nodes.update(data.id, data.data, function(result) {
                g.log('SEND: node-update -> : ' + data.id);
                socket.emit('node-update', { id: data.id, data: result, updatedAt: new Date().getTime() } );
            });
        },

        this.relDelete = function(data) {
            g.log('RECV : rel-delete -> ' + util.inspect(data));
            m.rels.delete(data.source, data.target, data.rel, function(success) {
                if(success) {
                    g.log('SEND: rel-delete -> ');
                    socket.emit('rel-delete', { source: data.source, target: data.target, rel: data.rel, updatedAt: new Date().getTime() } );
                }
                else {
                    g.log('FAIL: rel-delete -> ' + util.inspect(data));
                }
            });
        }
    }
}

exports.cmd = Command
