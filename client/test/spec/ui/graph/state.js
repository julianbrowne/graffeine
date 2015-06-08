
describe("UI State", function() { 

    beforeAll(function(done) { 
        require(["/lib/graffeine/loader.js"], function() { 
            console.log("test: loaded graffeine for spec");
            done();
        });
    });

    it("should have a Graffeine object", function() { 
        expect(Graffeine).toBeDefined();
    });

    it("should be defined", function() { 
        expect(Graffeine.ui.state).toBeDefined();
    });

    it("should have get and set functions", function() { 
        expect(Graffeine.ui.state.set).toBeDefined();
        expect(Graffeine.ui.state.get).toBeDefined();
    });

    it("should set and get state", function() { 
        var bob=99;
        Graffeine.ui.state.set("bob", bob);
        expect(Graffeine.ui.state.get("bob")).toEqual(bob);
    });

    it("should set state in one function", function() { 
        var alice="hello";
        Graffeine.ui.state.set("alice", alice);
        expect(Graffeine.ui.state.get("alice")).toEqual(alice);
    });

    it("should get state in another function", function() { 
        expect(Graffeine.ui.state.get("alice")).toEqual("hello");
    });

    it("should select node", function() { 
        Graffeine.ui.state.selectNode({ id: 1, name: "a"}, document.getElementsByTagName("body")[0]);
        expect(Graffeine.ui.state.selectedNode.data).toEqual({ id: 1, name: "a"});
        expect(Graffeine.ui.state.selectedNode.elem).toEqual(document.getElementsByTagName("body")[0]);
    });

    it("should unselect node", function() { 
        Graffeine.ui.state.selectNode({ id: 1, name: "a"}, document.getElementsByTagName("body")[0]);
        expect(Graffeine.ui.state.selectedNode.data).toEqual({ id: 1, name: "a"});
        expect(Graffeine.ui.state.selectedNode.elem).toEqual(document.getElementsByTagName("body")[0]);
        Graffeine.ui.state.unselectNode();
        expect(Graffeine.ui.state.selectedNode).toEqual(null);
    });

    it("should know a node is selected", function() { 
        Graffeine.ui.state.selectNode({ id: 1, name: "a"}, document.getElementsByTagName("body")[0]);
        expect(Graffeine.ui.state.nodeSelected()).toBe(true);
        Graffeine.ui.state.unselectNode();
        expect(Graffeine.ui.state.nodeSelected()).toBe(false);
    });

    it("should get selected node", function() { 
        Graffeine.ui.state.selectNode({ id: 1, name: "a"}, document.getElementsByTagName("body")[0]);
        var node = Graffeine.ui.state.getSelectedNode();
        expect(node).toEqual({ id: 1, name: "a"});
    });

    it("should get selected element", function() { 
        Graffeine.ui.state.selectNode({ id: 1, name: "a"}, document.getElementsByTagName("body")[0]);
        var element = Graffeine.ui.state.getSelectedElement();
        expect(element).toEqual(document.getElementsByTagName("body")[0]);
    });

});