/**
 *  UI Utilities
**/

Graffeine.ui.util = (new function(G) { 

    var self = this;

    this.init = function() { 
        console.log("init: ui.util");
    };

    this.init();

    return {

        loadPartial: function(url, target, then) { 
            //console.log("loading: %s for ", url, target);
            if($(target).length === 0) { 
                G.util.warning("No target "+target+" for "+url+": creating one");
                $("body").append($("<div>").attr("id", target.replace(/^\#/,"")));
            }
            $(target).load(url, function() { console.log("loaded: %s", url); if(then) then(); });
        },

        eventBlock: function() { 
            d3.event.stopPropagation();
            d3.event.preventDefault();
        },

        endDraglet: function() { 
            console.log("clearing graph ui state");
            graph.state.newPathActive = false;        
            graph.state.sourceNode = null;
            graph.state.hoveredNode = null;
            graph.state.draggedNode = null;
            if(graph.refs.svg)
                graph.refs.svg.selectAll(".connector").remove();
        },

        toggleButton: function(selector, values) { 
            if($(selector).length === 0) G.util.warning("No selector %s to toggle", selector);
            var current = $(selector).text();
            var newValue = (current === values[0]) ? values[1] : values[0];
            $(selector).text(newValue);
            $(selector).attr("data-mode", newValue);
            return newValue;
        },

        populateSelect: function(selector, items) { 
            if($(selector).length === 0) G.util.warning("No selector %s to populate", selector);
            var select = $(selector);
            select.empty();
            //select.append($("<option />").val("").text(""));
            items.forEach(function(option){
                select.append($("<option />").val(option).text(option));
            });
        },

        disableActionButtons: function() { 
            $(".action-button").prop('disabled', true);
        },

        enableActionButtons: function() { 
            $(".action-button").prop('disabled', false);
        },

        selectize: function(selector) { 
            var $select = $(selector).selectize({ 
                create: true, 
                valueField: 'value',
                labelField: 'text',
                openOnFocus: false,
                closeAfterSelect: true,
                options: [],
                sortField: 'text'
            });
            return $select[0].selectize;
        },

        addOptionsToSelectize: function(select, options) { 
            options.forEach(function(option) { 
                select.addOption({value: option, text: option});
            });
            select.refreshOptions(false);
        },

        // @todo change this to use D3 classed operator instead
        selectNode: function(element) { 
            var classNow = element.getAttribute("class");
            var classes = classNow.split(" ");
            if(classes.indexOf("selected")!==-1) return;
            element.setAttribute("class", classNow + " selected");
        },

        // @todo change this to use D3 classed operator instead
        unselectNode: function(element) { 
            var re = new RegExp(" selected", 'g');
            var newClass = element.getAttribute("class").replace(re, '');
            element.setAttribute("class", newClass);
        },

        event: function(selector, event, callback) { 
            if($(selector).length === 0) G.util.warning("No DOM elements found matching " + selector);
            $(selector).on(event, function(e) { 
                console.log("%s: %s", event, selector);
                callback(e);
            });
        }

    }

}(Graffeine));
