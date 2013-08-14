#!/usr/local/bin/phantomjs

/*global phantom */
console.log("Loading Google's /");

var webpage = require("webpage");

var config = {
    "url" : "http://www.google.com/"
};

var page = webpage.create();

page.open(config.url, function (status) {
    phantom.exit();
});

