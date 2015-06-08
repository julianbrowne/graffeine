/**
 *  Graffeine Path (Relationship) object
**/

Graffeine.model = (typeof Graffeine.model==="undefined") ? {} : Graffeine.model;

Graffeine.model.Path = function(source, target, name) { 
    this.source = source;
    this.target = target;
    this.name = name;
};
