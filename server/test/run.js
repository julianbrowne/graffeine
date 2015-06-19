
var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfigFile(__dirname + "/jasmine.json");

jasmine.configureDefaultReporter({ 
    showColors: true
});

jasmine.execute();
