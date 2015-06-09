
requirejs.config({ 
    baseUrl: "/lib/graffeine/js",
    paths: { 
        text: "/lib/require/text",
        json: "/lib/require/json"
    },
    shim: { 
        "graffeine/core": { 
            deps: [ "json!/config.json" ],
            exports: "Graffeine",
            init: function(config) { 
                Graffeine.config = config;
            }
        },
        "util/util": { deps: [ "graffeine/core" ] },
        "util/command": { deps: [ "graffeine/core", "util/util" ] },
        "ui/init": { deps: [ "graffeine/core", "util/util" ] },
        "model/node": { deps: [ "graffeine/core", "util/util" ] },
        "model/path": { deps: [ "graffeine/core", "util/util" ] },
        "ui/util": { deps: [ "graffeine/core", "util/util", "ui/init" ] },
        "ui/toolbar/logo": { deps: [ "graffeine/core", "util/util", "ui/init", "ui/util" ] },
        "ui/toolbar/menu": { deps: [ "graffeine/core", "util/util", "ui/init", "ui/util" ] },
        "ui/graph/menu": { deps: [ "graffeine/core", "util/util", "ui/init", "ui/util" ] },
        "ui/graph/stats": { deps: [ "graffeine/core", "util/util", "ui/init", "ui/util" ] },
        "ui/graph/state": { deps: [ "graffeine/core", "util/util", "ui/init", "ui/util" ] },
        "ui/node/info": { deps: [ "graffeine/core", "util/util", "ui/init", "ui/util" ] },
        "ui/node/edit": { deps: [ "graffeine/core", "util/util", "ui/init", "ui/util" ] },
        "ui/node/find": { deps: [ "graffeine/core", "util/util", "ui/init", "ui/util" ] },
        "ui/node/context": { deps: [ "graffeine/core", "util/util", "ui/init", "ui/util" ] },
        "ui/path/edit": { deps: [ "graffeine/core", "util/util", "ui/init", "ui/util" ] },
        "model/loader": { deps: [ "graffeine/core", "util/util" ] },
        "graph/graph": { deps: [ "graffeine/core", "util/util" ] },
        "graph/svg": { deps: [ "graffeine/core", "util/util" ] },
        "local/loader": { deps: [ "graffeine/core", "util/util" ] },
        "ui/loader": { deps: [ "graffeine/core", "util/util" ] },
        "local/fake-db": { deps: [ "graffeine/core", "util/util" ] }
    }
});

define([ 
        "graffeine/core",
        "util/command",
        "util/util",
        "ui/init",
        "ui/toolbar/logo",
        "ui/toolbar/menu",
        "ui/node/info",
        "ui/node/edit",
        "ui/node/find",
        "ui/node/context",
        "ui/path/edit",
        "ui/graph/menu",
        "ui/graph/stats",
        "ui/graph/state",
        "model/node",
        "model/path",
        "graph/graph",
        "graph/svg",
        "local/fake-db"
    ],
    function() { 
        console.log("loaded: Graffeine");
        return(Graffeine);
    }
);
