
define([ "graffeine/config", "graffeine/graffeine" ],

    function(config) { 
        console.log("loaded: graffeine core");
        Graffeine.config = config;
        console.log("loaded: graffeine config");
    }

);
