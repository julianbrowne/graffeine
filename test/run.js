
var util = require("util");
var Jasmine = require("jasmine");

var reporter = require("./reporter");

var jasmine = new Jasmine();

jasmine.loadConfigFile(__dirname + "/jasmine.json");

jasmine.configureDefaultReporter({ showColors: true });
jasmine.addReporter(reporter);

jasmine.execute();
