
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
        /**
         *  <div class="form-group">
         *      <label class="col-sm-3">id</label>
         *      <input class="col-sm-8" type="number" data-json-type="number" name="id" value="123">
         *  </div>
        **/
        expect(Graffeine.util.objToForm).toBeDefined();
        var form = Graffeine.util.objToForm();
        expect(form).toEqual('');
        // @todo: add more variations here
        var form = Graffeine.util.objToForm({id: 123});
        expect($(form).find("label").length).toEqual(1);
        expect($(form).find("input").length).toEqual(1);
        expect($(form).find("input").attr("type")).toEqual("number");
    });

    it("should insert anchor tags for URLs", function() { 
        expect(Graffeine.util.addURLTags).toBeDefined();
        var text = "a http://link/ to a https://site/a/b/c";
        var html = Graffeine.util.addURLTags(text);
        expect(html).toEqual("a <a href=\"http://link/\">http://link/</a> to a <a href=\"https://site/a/b/c\">https://site/a/b/c</a>");
    });

    it("should rowify all json data types", function() { 
        expect(Graffeine.util.rowify).toBeDefined();
        expect(Graffeine.util.rowify("a", "abc").prop('outerHTML'))
            .toEqual("<tr><th>a</th><td data-type=\"string\">abc</td></tr>");
    });

    it("should determine empty variable", function() { 
        expect(Graffeine.util.isEmpty).toBeDefined();
        expect(Graffeine.util.isEmpty("a")).toBe(false);
        expect(Graffeine.util.isEmpty(123)).toBe(false);
        expect(Graffeine.util.isEmpty({a:10})).toBe(false);
        expect(Graffeine.util.isEmpty(null)).toBe(true);
        expect(Graffeine.util.isEmpty(undefined)).toBe(true);
        expect(Graffeine.util.isEmpty("")).toBe(true);
        expect(Graffeine.util.isEmpty('')).toBe(true);
    });

    it("should make list from an object", function() { 
        expect(Graffeine.util.objToList).toBeDefined();
        expect(Graffeine.util.objToList({id: 123}).prop('outerHTML'))
            .toEqual("<ul class=\"list-group\"><li class=\"list-group-item\"><div class=\"list-group-row\"><div class=\"list-group-field-name\">id</div><div class=\"list-group-field-value\">123</div></div></li></ul>");
        expect(Graffeine.util.objToList({link: "http://neo4j.com/"}).prop('outerHTML'))
            .toEqual("<ul class=\"list-group\"><li class=\"list-group-item\"><div class=\"list-group-row\"><div class=\"list-group-field-name\">link</div><div class=\"list-group-field-value\"><a href=\"http://neo4j.com\">http://neo4j.com</a></div></div></li></ul>");
        // @todo: add more variations here
    });

});