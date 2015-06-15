
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

    function objectLength(o) { 
        if (typeof o.length === 'number' && !(o.propertyIsEnumerable('length')) && typeof o.splice === 'function')
            return o.length;
        else
            return Object.getOwnPropertyNames(o).length;        
    }

    function addURLTags(text) { 
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, '<a href="$1">$1</a>')
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

    function rowify(name, value) { 
        var type  = getType(value);
        var makeRow = function(name, value, type) { 
            var tr = $("<tr>");
            var key = $("<th>").html(name);
            var value = $("<td>").html(value).attr("data-type", type);
            return tr.append(key).append(value);
        };
        switch(type) { 
            case "string":
                return makeRow(name, value, "string"); break;
            case "number": 
                return makeRow(name, value, "number"); break;
            case "function": 
                console.log("rowify function");
                break;
            default: 
                return makeRow(name, value, "unknown"); break;
        };
    };

    function objToForm(obj, opts) { 
        if(typeof obj === "undefined") return "";
        var opts = (opts === undefined) ? {} : opts;
        var form = $("<form>");
        Object.keys(obj).forEach(function(k) { 
            var group = $("<div>").addClass("form-group");
            var label = $("<label>").addClass("col-sm-3").html(k);
            var field = (opts[k] === undefined) ? objToField(obj[k], k) : objToField(opts[k].data, k);
            group.append(label);
            group.append(field);
            form.append(group);
        });
        return form;
    };

    function objToList(obj, levels) { 
        if(levels===undefined) levels = 3;
        console.log(levels);
        if(typeof obj === "undefined"||obj === null) return "empty";
        var ul = $("<ul>").addClass("list-group");
        if(levels<3) ul.addClass("inner");
        for(var key in obj) { 
            var type = getType(obj[key]);
            if(type==="function")
                continue;
            if((obj[key]===null)||(obj[key]===undefined)||(obj[key]==="")||(typeof obj[key]==="boolean")) { 
                var value = $("<div>").addClass("strong").html(obj[key].toString()); 
            }
            else { 
                var value = $("<div>").html(obj[key]);
            }
            value.addClass("list-group-field-value")
            if((type==="object"||type==="array")&&(obj[key] !== null)) { 
                var size = (type==="array") ? obj[key].length.toString() : Object.keys(obj[key]).length.toString();
                value = $("<div>").addClass("badge").html(size);
            }
            var li = $("<li>").addClass("list-group-item");
            var fieldName = $("<div>").addClass("list-group-field-name").html(key);
            li.append($("<div>").addClass("list-group-row").html(fieldName).append(value));
            if(((type === "object")||(type === "array")) && ((obj[key] !== null) && (levels>0))) { 
                fieldName.addClass("list-group-section");
                li.append(objToList(obj[key], --levels));
            }
            ul.append(li);
        };
        return ul;
    };

    return { 

        getType: getType,
        addURLTags: addURLTags,
        objectLength: objectLength,
        rowify: rowify,
        objToForm: objToForm,
        objToList: objToList,

        warning: function(text) { 
            var caller = (arguments.callee.caller.name) ? arguments.callee.caller.name+":" : "";
            console.warn("%c warning: " + caller + text, "color: #C62C17");
        },

        debug: function(text) { 
            var caller = (arguments.callee.caller.name) ? arguments.callee.caller.name+":" : "";
            console.log("-- %c debug:" + caller + text, "color: #1398E4");
        }
    };

}());
