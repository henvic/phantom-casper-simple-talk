/*global phantom */

var webpage = require("webpage");

var config = {
    "url" : "http://g1.globo.com/"
};

var jsFilesCounter = 0;

var page = webpage.create();

page.onResourceReceived = function (response) {
    if (response.contentType == "application/x-javascript") {
        jsFilesCounter += 1;
    }
};

page.onLoadFinished = function (status) {
    console.log("Title: " + page.title);
    console.log("Status: " + status);
    console.log("A total of " + jsFilesCounter + " JS application files were downloaded.");
    //uncomment the line below to print the page's text content
    //console.log("Content:\n" + page.plainText);
};

console.log("Opening " + config.url);

page.open(config.url, function (status) {
    page.evaluate() {
    });
    phantom.exit();
});

