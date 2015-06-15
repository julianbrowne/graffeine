/**
 *  UI Utilities
**/

Graffeine.ui.util = (new function(G) { 

    var ui = G.ui;

    this.init = function() { 
        console.log("init: ui.util");
    };

    this.init();

    return { 

        loadPartial: function(url, target, callback) { 
            if($(target).length === 0) { 
                console.error("ui.util.loadPartial: no target %s for %s", target, url);
                return;
            }
            $(target).load(url, function(response, status, xhr) { 
                console.log("loaded: %s: [%s]", url, status);
                if (status==="error") { 
                    console.error("ui.util.loadPartial: error %s: %s", xhr.status, xhr.statusText);
                }
                else { 
                    if(typeof callback === "function" ) setTimeout(callback, 0);
                }
            });
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

        modal: function(selector) { 

            if($(selector).length === 0) { 
                console.error("ui.util.modal: no DOM elements found matching " + selector);
                return;
            };

            setTimeout(function() { 
                var modal = $(selector).modal({keyboard: true, background: "static", show: false});
                $(selector).on("show.bs.modal", function() { 
                    ui.state.setMenuActive();
                });
                $(selector).on("hide.bs.modal", function() { 
                    ui.state.unsetMenuActive();
                });
                console.log("ui.util.modal: set modal for %s", selector);
                ["show.bs.modal", "shown.bs.modal", "hidden.bs.modal", "hide.bs.modal", "loaded.bs.modal"]
                    .forEach(function(event) { 
                        $(selector).on(event, function(e) { 
                            console.log("%s: registered %s event", selector, event);
                        });
                    });
            }, 0);

        },

        event: function(selector, event, callback) { 
            if($(selector).length === 0) { 
                console.error("ui.util.event: No DOM elements found matching " + selector);
                return;
            };
            $(selector).on(event, function(e) { 
                callback(e);
            });
        }

    }

}(Graffeine));
