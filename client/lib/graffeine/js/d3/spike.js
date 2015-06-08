

(function(G) { 

    d3.selection.prototype.jb = 
    d3.selection.enter.prototype.jb = function() { 
        return this.attr('data-editable', true);
    }

})(Graffeine);
