
var graffeineTestHelper = { 

    addTargetDomElement: function(id) { 
        if($("#"+id).length===0)
            $("body").append($("<div>").attr("id", id).css("display", "none"));
        var target = $("#"+id);
        return target;
    },

    removeTargetDomElement: function(selection) { 
        if(selection.length===0) return;
        selection.remove();
    },

    objectLength: function(o) { 
        if (typeof o.length === 'number' && !(o.propertyIsEnumerable('length')) && typeof o.splice === 'function')
            return o.length;
        else
            return Object.getOwnPropertyNames(o).length;        
    },

    getSocketEventCallback: function(event) { 
        var socket = Graffeine.socket();
        console.log(socket);
        var callbacks = socket._callbacks[event];
        if(callbacks.length>1) console.warn("More than one callback registered for %s", event);
        return callbacks[0];
    },

    duplicateIds: function() { 
        var dups = [];
        $('[id]').each(function() { 
            var ids = $('[id="'+this.id+'"]');
            if(ids.length>1 && ids[0]==this) dups.push("#"+this.id);
        });
        return dups;
    }

};