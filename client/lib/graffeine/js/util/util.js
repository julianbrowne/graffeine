
Graffeine.util = (function() { 

    function getType(obj) { 
        var s = typeof obj;
        if (s === 'object') { 
            if (obj) { 
                if (typeof obj.length === 'number' && !(obj.propertyIsEnumerable('length')) && typeof obj.splice === 'function') { 
                    s = 'array';
                }
            }
            else
                s = 'null';
        }
        return s;
    };

    function objToField(obj, name) { 

        var type  = getType(obj);

        switch(type) { 

            case "string":
                return $("<input>")
                    .addClass("col-sm-8")
                    .attr("type", "text")
                    .attr("data-json-type", type)
                    .attr("name", name)
                    .attr("value", obj);
                break;
            
            case "number": 
                return $("<input>")
                    .addClass("col-sm-8")
                    .attr("type", "number")
                    .attr("data-json-type", type)
                    .attr("name", name)
                    .attr("value", obj);
                break;
              
            case "array": 
                var container = $("<div>")
                    .addClass("form-inline")
                obj.forEach(function(element, index) { 
                    var field = objToField(element, index);
                    field.addClass("col-sm-4");
                    container.append(field);
                });
                return container;
                break;

            case "boolean": 
                return $("<input>")
                    .attr("type", "checkbox")
                    .attr("data-json-type", type)
                    .attr("name", name)
                    .attr("value", obj)
                    .prop("checked", obj);
                break;

            default: 
                util.warning("No element found for type of " + type);
                return $("<div>")
                    .html("-- could not parse field --");
        }

    };

    return { 

        getType: getType,

        warning: function(text) { 
            var caller = (arguments.callee.caller.name) ? arguments.callee.caller.name+":" : "";
            console.log("** %c warning: " + caller + text, "color: #C62C17");
        },

        debug: function(text) { 
            var caller = (arguments.callee.caller.name) ? arguments.callee.caller.name+":" : "";
            console.log("-- %c debug:" + caller + text, "color: #1398E4");
        },

        objToForm: function(obj, opts) { 
            Graffeine.util.debug(JSON.stringify(obj));
            if(obj===undefined) return "";
            var opts = (opts === undefined) ? {} : opts;
            var form = $("<form>");
            Object.keys(obj).forEach(function(key) { 
                var group = $("<div>").addClass("form-group");
                var label = $("<label>")
                    .addClass("col-sm-3")
                    .html(key);
                if(opts[key] === undefined)
                    var field = objToField(obj[key], key);
                else
                    var field = objToField(opts[key].data, key);
                group.append(label);
                group.append(field);
                form.append(group);
            });
            return form;
        }

    };

}());
