/**
 *  UI Utilities
**/

Graffeine.ui.util = (function(G) { 

    var ui = G.ui;
    var graph = G.graph;

    function yield(f) { 
        setTimeout(f,0);
    };

    function suggestLabelCSS(node) { 
        var nodeLabels = node.labels;
        var graphLabels = graph.getNodeLabels();
        if(nodeLabels===[]||graphLabels===[]) return "";
        // @todo: uses first lable only, maybe a better way
        // to represent all node labels with a background color?
        var match = graphLabels.indexOf(nodeLabels[0]);
        if(match!==-1&&match<=7) { // only 7 bg colours in the stylesheet
            return "bg"+(match+1).toString();
        }
        return "";
    };

    function dynamicModal(title, content) { 
        var modalId = "#custom-modal";
        var customModal = $('<div id="custom-modal" class="modal" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title">Modal</h4> </div> <div id="custom-modal-body" class="modal-body"> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">OK</button> </div> </div> </div> </div>');
        $("body").append(customModal);
        $(modalId).find($("h4")).html(title);
        ui.util.modal(modalId);
        event(modalId, "show.bs.modal", function() { 
            $("#custom-modal-body").html(content);
        });
        event(modalId, "hidden.bs.modal", function() { 
            $(modalId).remove();
        });
        setTimeout(function() { $(modalId).modal("show"); }, 0);
        return modalId;
    };

    function event(selector, event, callback) { 
        if($(selector).length === 0) { 
            console.error("ui.util.event: No DOM elements found matching " + selector);
            return;
        };
        G.util.debug("%s: registered callback for %s", selector, event);
        $(selector).on(event, function(e, data) { 
            if($(selector).hasClass("disabled")) { 
                console.warn("%s: %s ignored - disabled", selector, event);
                return;
            }
            G.util.debug("%s: recorded event %s", selector, event);
            callback(e, data);
        });
    };

    function prettyObject(obj) { 
        return JSON.stringify(obj, null, 2);
    };

    function highlightModalCode(selector) { 
        $(selector).find(".modal-body").each(function(i, block) { 
            hljs.highlightBlock(block);
        });
    };

    function updateFlash(category, title, message) { 

        var fadeAfterMs = 20000;
        var fadeDuration = 8000;

        if(["success","info","warning","danger"].indexOf(category) === -1) { 
            console.warn("util.updateFlash: unknown category %s, switching to info", category);
            category = "info";
        }

        var alertClass = "alert-" + (category||"info");

        var container = $("<div>")
            .addClass("alert alert-dismissible " + alertClass)
            .attr("role", "alert");

        var closeButton = $("<button>")
            .attr("type", "button")
            .addClass("close")
            .attr("data-dismiss", "alert")
            .attr("aria-label", "close");

        var span = $("<span>")
            .attr("aria-hidden", "true")
            .html("&times;");

        closeButton.append(span);
        container.append(closeButton);
        container.append("<strong>" + title + ": </strong>" + message);

        if($("#flash").length === 0)
            util.warning("warning: no flash for server message");

        $("#flash").prepend(container);

        setTimeout(function() { 
            container.fadeOut(fadeDuration, function() { });
        }, fadeAfterMs);

    };

    function dynamicSelect(id, items) { 
        var select = $("<select>").attr("id", id);
        items.forEach(function(option){
            select.append($("<option>").val(option).text(option));
        });
        return select;
    };

    return { 
        suggestLabelCSS: suggestLabelCSS,
        dynamicModal: dynamicModal,
        prettyObject: prettyObject,
        event: event,
        highlightModalCode: highlightModalCode,
        dynamicSelect: dynamicSelect,
        updateFlash: updateFlash,
        loadPartial: function(url, target, callback) { 
            if($(target).length === 0) { 
                console.error("ui.util.loadPartial: no target %s for %s", target, url);
                return;
            }
            $(target).load(url, function(response, status, xhr) { 
                G.util.debug("ui.util.loadPartial: %s", url);
                if (status==="error") { 
                    console.error("ui.util.loadPartial: error %s: %s", xhr.status, xhr.statusText);
                }
                else { 
                    if(typeof callback === "function" ) yield(callback);
                }
            });
        },

        toggleButton: function(selector, values) { 
            if($(selector).length === 0) console.warn("No selector %s to toggle", selector);
            var current = $(selector).text();
            var newValue = (current === values[0]) ? values[1] : values[0];
            $(selector).text(newValue);
            $(selector).attr("data-mode", newValue);
            return newValue;
        },

        populateSelect: function(selector, items) { 
            if($(selector).length === 0) console.warn("No selector %s to populate", selector);
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

        disableGraphButtons: function() { 
            yield(function() { 
                if($(".disable-when-graph-empty").length===0)
                    console.warn("no graph buttons found");
                $(".disable-when-graph-empty").addClass("disabled");
            });
        },

        forceButton: function(value) { 
            if(value!=="on"&&value!=="off") { 
                console.warn("forceButton: called with unknown value %s", value);
                return;
            }
            if(value==="on")
                $("#graph-force")
                    .text("off")
                    .prop("aria-pressed", "true")
                    .addClass("active")
                    .addClass("on")
                    .removeClass("off");
            else
                $("#graph-force")
                    .text("on")
                    .prop("aria-pressed", "false")
                    .removeClass("active")
                    .addClass("off")
                    .removeClass("on");
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

            yield(function() { 
                var modal = $(selector).modal({keyboard: true, background: "static", show: false});
                $(selector).on("show.bs.modal", function() { 
                    ui.state.setMenuActive();
                });
                $(selector).on("hide.bs.modal", function() { 
                    ui.state.unsetMenuActive();
                });
                G.util.debug("ui.util.modal: set modal for %s", selector);
                ["show.bs.modal", "shown.bs.modal", "hidden.bs.modal", "hide.bs.modal", "loaded.bs.modal"]
                    .forEach(function(event) { 
                        $(selector).on(event, function(e) { 
                            console.log("%s: registered %s event", selector, event);
                        });
                    });
            });

        }
    }

}(Graffeine));
