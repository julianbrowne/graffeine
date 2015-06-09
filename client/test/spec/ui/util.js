
describe("UI Util", function() { 

    beforeAll(function(done) { 
        require(["/lib/graffeine/loader.js"], function() { 
            console.log("test: loaded graffeine for spec");
            Graffeine.init();
            done();
        });
    });

    it("should have a Graffeine object", function() { 
        expect(Graffeine).toBeDefined();
    });

    it("should be defined", function() { 
        expect(Graffeine.ui).toBeDefined();
        expect(Graffeine.ui.util).toBeDefined();
    });

    it("should load a partial into the DOM", function(done) { 
        var target = "#test-loader";
        Graffeine.ui.util.loadPartial("html/test.html", target, function() { 
            expect($(target).html()).toEqual("<p></p>");
            done();
        });
    });

    it("should toggle buttons", function() { 
        var target = "toggler";
        var mode = null;
        $("body").append($("<button>").attr("id", target).html("on").css("display", "none"));
        mode = Graffeine.ui.util.toggleButton("#"+target, ["on", "off"]);
        expect(mode).toEqual("off");
        mode = Graffeine.ui.util.toggleButton("#"+target, ["on", "off"]);
        expect(mode).toEqual("on");
        mode = Graffeine.ui.util.toggleButton("#"+target, ["on", "off"]);
        expect(mode).toEqual("off");
        $("#"+target).remove();
    });

    it("should populate SELECT list", function() { 
        var target = "lister";
        $("body").append($("<select>").attr("id", target).css("display", "none"));
        Graffeine.ui.util.populateSelect("#"+target, ["a", "b"]);
        expect($("#"+target).html()).toEqual('<option value="a">a</option><option value="b">b</option>');
        $("#"+target).remove();
    });

    it("should disable buttons", function() { 
        var target = "buttoner";
        $("body").append($("<button>").attr("id", target).addClass("action-button").css("display", "none"));
        Graffeine.ui.util.disableActionButtons();
        expect($("#"+target).prop("disabled")).toEqual(true);
        $("#"+target).remove();
    });

    it("should enable buttons", function() { 
        var target = "buttoner";
        $("body").append($("<button>").attr("id", target).addClass("action-button").css("display", "none"));
        Graffeine.ui.util.disableActionButtons();
        expect($("#"+target).prop("disabled")).toEqual(true);
        Graffeine.ui.util.enableActionButtons();
        expect($("#"+target).prop("disabled")).toEqual(false);
        $("#"+target).remove();
    });

    it("should indicate selected node by class", function() { 
        var target = "node-selected";
        $("body").append($("<div>").attr("id", target).addClass("something").css("display", "none"));
        expect($("#"+target).attr("class")).toEqual("something");
        var element = $("#"+target)[0];
        Graffeine.ui.state.selectNode({}, element);
        expect($("#"+target).attr("class")).toEqual("something selected");
        Graffeine.ui.state.selectNode({}, element);
        expect($("#"+target).attr("class")).toEqual("something selected");
        $("#"+target).remove();
    });

    it("should indicate unselected node by class", function() { 
        $("body").append($("<div>").attr("id", "node-selected").addClass("something").css("display", "none"));
        expect($("#node-selected").attr("class")).toEqual("something");
        var element = $("#node-selected")[0];
        Graffeine.ui.state.selectNode({}, element);
        Graffeine.ui.state.unselectNode();
        expect($("#node-selected").attr("class")).toEqual("something");
        $("node-selected").remove();
    });

    it("should selectize a selection", function() { 
        $("body")
            .append($("<select>")
            .attr("id", "selector")
            .addClass("dummy")
            .css("display", "none"));
        var options = Graffeine.ui.util.selectize("#selector");
        expect($("#selector").attr("class")).toEqual("dummy selectized")
        expect($("div.selectize-control").length).toBeGreaterThan(0);
        Graffeine.ui.util.addOptionsToSelectize(options, ["a", "b"]);
        var populatedOptions = $("div.selectize-dropdown-content").children();
        expect(populatedOptions).toBeDefined();
        console.log(populatedOptions);
        expect(populatedOptions.length).toEqual(2);
        expect($(populatedOptions[0]).attr("data-value")).toEqual("a");
        expect($(populatedOptions[0]).html()).toEqual("a");
        expect($(populatedOptions[1]).attr("data-value")).toEqual("b");
        expect($(populatedOptions[1]).html()).toEqual("b");
        Graffeine.ui.util.addOptionsToSelectize(options, ["a", "b", "c", "d"]);
        var populatedOptions = $("div.selectize-dropdown-content").children();
        expect(populatedOptions.length).toEqual(4);
        expect($(populatedOptions[0]).attr("data-value")).toEqual("a");
        expect($(populatedOptions[0]).html()).toEqual("a");
        expect($(populatedOptions[3]).attr("data-value")).toEqual("d");
        expect($(populatedOptions[3]).html()).toEqual("d");
        $("#selector").remove();
    });

});
