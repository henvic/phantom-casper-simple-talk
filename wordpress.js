/*global require, __utils__, console */
/*jshint indent:4 */

var exports = function () {
    "use strict";

    var casper;

    var config = {
        "host" : "http://demo.opensourcecms.com/wordpress",
        "credentialsForm" : {
            "log" : "admin",
            "pwd" : "demo123"
        }
    };

    var setUp = function () {
        casper = require('casper').create({
            verbose: true
        });

        if (casper.cli.has("host")) {
            config.host = casper.cli.get("host");
        }

        if (casper.cli.has("username")) {
            config.credentialsForm.log = casper.cli.get("username");
        }

        if (casper.cli.has("password")) {
            config.credentialsForm.pwd = casper.cli.get("password");
        }

        var useDefault = casper.cli.has("default");

        console.log("Use: casperjs test wordpress.js --username=your-user --password=your-pass --host=your-host");
        console.log("Or just casperjs test wordpress.js to use http://demo.opensourcecms.com/wordpress");
        console.log("With the username (admin) and password (demo123)\n");

        casper.start();

        casper.thenOpen(config.host + "/wp-login.php", function () {
            this.fill('form[id="loginform"]', config.credentialsForm, true);
        });

        casper.then(function () {
            this.test.assertHttpStatus(200, "Authentication successful");
            this.test.assertTitleMatch(/Dashboard/, "Dashboard's expected title has 'Dashboard' on it");
            this.test.assertUrlMatch(/wordpress\/wp-admin\//, "Dashboard has the /wordpress/wp-admin/ path on it");
            this.test.assertExists("#wp-admin-bar-new-content");
            this.test.assertElementCount("#wp-admin-bar-new-post a", 1);
            this.click("#wp-admin-bar-new-post a");
        });

        casper.then(function () {
            this.test.assertHttpStatus(200, "Open the Add New Post page");
            this.test.assertTitleMatch(/Add New Post/, "Expected Add New Post page title");
            this.test.assertExists("form#post", "Form for posting a new post found");
            this.test.assertExists("#postdivrich", "Div rich editor area found");

            var result = casper.thenEvaluate(function () {
                document.querySelector("#title").value = "Testando com o CasperJS + PhantomJS: " + new Date();
                document.querySelector("#content").value = "Conteúdo de teste adicionado.";
                document.querySelector("#publish").click();

                return document.querySelector("#message a");
            });

            casper.then(function () {
                this.wait(4000, function() {
                    this.test.assertTitleMatch(/Edit Post/, "Expected Edit New Post page title");
                    this.test.assertExists("#message");
                    this.echo("URL: " + result.toString());
                });
            });
        });

        casper.test.tearDown(function() {
            casper.echo("Any teardown to undo temporary changes...");
        });

        casper.run(function () {
            this.test.done();
            this.echo("End of execution.");
            this.exit();
        });
    };

    return setUp;
} ();

exports();
