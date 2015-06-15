
describe("UI State", function() { 

    var state;

    beforeAll(function(done) { 
        require(["/lib/graffeine/loader.js"], function() { 
            console.log("test: loaded graffeine for spec");
            Graffeine.init();
            state = Graffeine.ui.state;
            done();
        });
    });

    it("should be defined", function() { 
        expect(state).toBeDefined();
    });

    it("should select node", function() { 
        state.selectNode({ id: 1, name: "a"}, document.getElementsByTagName("body")[0]);
        expect(state.selectedNode.node).toEqual({ id: 1, name: "a"});
        expect(state.selectedNode.element).toEqual(document.getElementsByTagName("body")[0]);
    });

    it("should unselect node", function() { 
        state.selectNode({ id: 1, name: "a"}, document.getElementsByTagName("body")[0]);
        expect(state.selectedNode.node).toEqual({ id: 1, name: "a"});
        expect(state.selectedNode.element).toEqual(document.getElementsByTagName("body")[0]);
        state.unselectNode();
        expect(state.selectedNode).toEqual(null);
    });

    it("should know a node is selected", function() { 
        state.selectNode({ id: 1, name: "a"}, document.getElementsByTagName("body")[0]);
        expect(state.nodeSelected()).toBe(true);
        state.unselectNode();
        expect(state.nodeSelected()).toBe(false);
    });

    it("should get selected node", function() { 
        state.selectNode({ id: 1, name: "a"}, document.getElementsByTagName("body")[0]);
        var node = state.getSelectedNode();
        expect(node).toEqual({ id: 1, name: "a"});
    });

    it("should get selected element", function() { 
        state.selectNode({ id: 1, name: "a"}, document.getElementsByTagName("body")[0]);
        var element = state.getSelectedElement();
        expect(element).toEqual(document.getElementsByTagName("body")[0]);
    });

    it("should select a source node", function() { 
        state.selectSourceNode("abc");
        var selectedNode = state.getSelectedSourceNode();
        expect(selectedNode).toEqual("abc");
        expect(state.sourceNodeSelected()).toBe(true);
    });

    it("should select a target node", function() { 
        state.selectTargetNode("xyz");
        var selectedNode = state.getSelectedTargetNode();
        expect(selectedNode).toEqual("xyz");
        expect(state.targetNodeSelected()).toBe(true);
    });

    it("should retreive a source node in another context", function() { 
        var selectedNode = state.getSelectedSourceNode();
        expect(selectedNode).toEqual("abc");
    });

    it("should retreive a target node in another context", function() { 
        var selectedNode = state.getSelectedTargetNode();
        expect(selectedNode).toEqual("xyz");
    });

    it("should unselect a source node", function() { 
        state.unselectSourceNode();
        var selectedNode = state.getSelectedSourceNode();
        expect(selectedNode).toEqual(null);
        expect(state.sourceNodeSelected()).toBe(false);
    });

    it("should unselect a target node", function() { 
        state.unselectTargetNode();
        var selectedNode = state.getSelectedTargetNode();
        expect(selectedNode).toEqual(null);
        expect(state.targetNodeSelected()).toBe(false);
    });

    it("should hover a node", function() { 
        state.hoverNode("123","abc");
        expect(state.nodeHovered()).toBe(true);
        expect(state.getHoveredNode()).toEqual("123");
        expect(state.getHoveredElement()).toEqual("abc");
    });

    it("should retreive a hovered node in another context", function() { 
        var hoveredNode = state.getHoveredNode();
        expect(hoveredNode).toEqual("123");
        var hoveredElement = state.getHoveredElement();
        expect(hoveredElement).toEqual("abc");
    });

    it("should unhover a node", function() { 
        state.unhoverNode();
        expect(state.nodeHovered()).toBe(false);
        expect(state.getHoveredNode()).toEqual(null);
        expect(state.getHoveredElement()).toEqual(null);
    });

    it("should keep count of nodes on screen", function() { 
        state.nodesOnDeck(99);
        expect(state.nodesOnDeck(99)).toEqual(99);
        state.nodesOnDeck(0);
        expect(state.nodesOnDeck(0)).toEqual(0);
    });

});