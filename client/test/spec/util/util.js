
describe("Graffeine Util", function() { 

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
        expect(Graffeine.util).toBeDefined();
    });

    it("should match types", function() { 
        expect(Graffeine.util.getType('a')).toEqual('string');
        expect(Graffeine.util.getType(99)).toEqual('number');
        expect(Graffeine.util.getType(9.9)).toEqual('number');
        expect(Graffeine.util.getType([1,2,3])).toEqual('array');
        expect(Graffeine.util.getType({})).toEqual('object');
    });

    it("should convert object to form", function() { 
        expect(Graffeine.util.objToForm).toBeDefined();
        var form = Graffeine.util.objToForm();
        expect(form).toEqual('');
        var form = Graffeine.util.objToForm({id: 123});
        console.log(form[0].innerHTML);
        expect(form[0].innerHTML).toEqual('<div class="form-group"><label class="col-sm-3">id</label><input class="col-sm-8" type="number" data-json-type="number" name="id" value="123"></div>');
        // more tests needed here
    });

});