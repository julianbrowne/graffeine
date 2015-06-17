
Graffeine.model = (typeof Graffeine.model==="undefined") ? {} : Graffeine.model;

Graffeine.model.Node = function(graffnode) { 

    var node = this;
    var ui = Graffeine.ui;
    var graffnode = (graffnode) ? graffnode : { data: {} };

    Object.keys(graffnode).forEach(function(key) { 
        node[key] = graffnode[key];
    });

    this.labels = graffnode.labels ? graffnode.labels : [];
    this.type = (typeof graffnode.type === "undefined") ? "default" : graffnode.type;
    this.data = (typeof graffnode.data === "undefined") ? {} : graffnode.data;
    this.isEdgeNode = false; // set final true/false when paths are added
    this.x = 500; //parseInt(Graffeine.config.graphSettings.width/2);
    this.y = 500; //parseInt(Graffeine.config.graphSettings.height/2);

    this.getName = function() { 

        // first name choice is "name" field

        if(this.name!==undefined)
            return (Graffeine.util.getType(this.name)==='array') ? this.name.join(' ') : this.name;

        // use id if there's nothing to work with

        if(this.data===undefined||this.data===null) return this.id;

        // or choose name from config name fields

        var name = null;

        for(var i=0; i<Graffeine.config.node.nameFields.length; i++) { 
            var field = Graffeine.config.node.nameFields[i];
            if(this.data[field]!==undefined)
                return (Graffeine.util.getType(this.data[field])==='array') ? this.data[field].join(' ') : this.data[field];
        };

        return "no-name";

    };

    this.addLabels = function(labelsArray) { 
        this.labels = labelsArray;
    };

    // @todo: switch icon on node type
    this.getIconName = function() { 
        return "glyphicon-record";
    };

    this.getType = function() {
        return this.type;
    };

    this.paths = function() { 
        return Graffeine.graph.paths().filter(function(p) { 
            return (p.source.id === node.id || p.target.id === node.id)
        });
    };

    /**
     * transfer over d3 force fields to smooth updates
    **/

    this.transferD3Data = function(oldNode) {
        fields = [ 'x', 'y', 'px', 'py', 'weight', 'index']
        var node = this;
        fields.forEach(function(field) {
            node[field] = oldNode[field];
        });
    };

};
