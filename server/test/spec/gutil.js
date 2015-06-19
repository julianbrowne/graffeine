
var proxyquire =  require('proxyquire')
var configStub = {};
var fsStub = {};
var gutil = proxyquire("../../lib/gutil", { 
    "../config/server.json": configStub,
    "fs": fsStub
});

describe('gutil', function() { 

    beforeEach(function() { 
        spyOn(console, 'log');
    })

    it("should exist", function() { 
        expect(gutil).toBeDefined();
    });

    it("should print low-level messages", function() { 
        gutil.gprint("test-type", "test-message");
        expect(console.log.calls.mostRecent().args[0]).toEqual("%s: %s - %s");
        expect(console.log.calls.mostRecent().args[1]).toMatch(match.timestamp());
        expect(console.log.calls.mostRecent().args[2]).toEqual("test-type");
        expect(console.log.calls.mostRecent().args[3]).toEqual("test-message");
    });

    it("should get gists", function() { 
        fsStub.readdir = function(dir, callback) { 
            callback(null, ["a","b","c"]);
        };
        var gists = gutil.getGists();
        expect(gists).toBeDefined();
        expect(gists).not.toBe(null);
        expect(gists).toEqual(["a","b","c"]);
    });

    it("should die", function() { 
        spyOn(process, 'exit');
        gutil.die("some error");
        expect(process.exit).toHaveBeenCalledWith(-1);
    });

    it("format integer output", function() { 
        expect(gutil.format(9, 1)).toEqual("9");
        expect(gutil.format(9, 2)).toEqual("09");
        expect(gutil.format(9, 3)).toEqual("009");
        expect(gutil.format(9, 4)).toEqual("0009");
    });

    it("should create timestamp", function() { 
        var ts = gutil.timestamp();
        expect(ts).toEqual(jasmine.stringMatching(match.timestamp()));
    });

    it("should log debug correctly", function() { 
        configStub.debug = true;
        gutil.debug("%s %s", 1, 2);
        expect(console.log.calls.mostRecent().args[0]).toEqual("%s: %s - %s");
        expect(console.log.calls.mostRecent().args[1]).toMatch(match.timestamp());
        expect(console.log.calls.mostRecent().args[2]).toEqual("DBG");
        expect(console.log.calls.mostRecent().args[3]).toEqual("1 2");
    });

    it('should log information correctly', function() { 
        gutil.log("%s %s", 1, 2);
        expect(console.log.calls.mostRecent().args[0]).toEqual("%s: %s - %s");
        expect(console.log.calls.mostRecent().args[1]).toMatch(match.timestamp());
        expect(console.log.calls.mostRecent().args[2]).toEqual("INF");
        expect(console.log.calls.mostRecent().args[3]).toEqual("1 2");
    });

    it('should log errors correctly', function() { 
        gutil.error("%s %s", 1, 2);
        expect(console.log.calls.mostRecent().args[0]).toEqual("%s: %s - %s");
        expect(console.log.calls.mostRecent().args[1]).toMatch(match.timestamp());
        expect(console.log.calls.mostRecent().args[2]).toEqual("ERR");
        expect(console.log.calls.mostRecent().args[3]).toEqual("1 2");
    });
});
