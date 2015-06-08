
requirejs.config({ baseUrl: '/lib/graffeine/js' });

define([ 
        'graffeine/loader', 
        'ui/loader-core', 
        'util/loader', 
        'model/loader', 
        'graph/loader', 
        'local/loader', 
        'ui/loader', 
        'event/loader', 
        'd3/loader'
    ],

    function() { 
        console.log("loaded: dependencies");
        console.log(Graffeine);
    }

);
