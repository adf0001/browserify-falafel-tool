
//global variable, for html page, refer tpsvr @ npm.
browserify_falafel_tool = require("../browserify-falafel-tool.js");
var browserify_transform_tools = require('browserify-transform-tools');
var fs = require("fs");

var sampleFile = __dirname + "/sample/sample.js";

module.exports = {

	"transfer": function (done) {
		if (typeof window !== "undefined") throw "disable for browser";

		var txt = fs.readFileSync(sampleFile);

		browserify_transform_tools.runTransform(browserify_falafel_tool, sampleFile,
			{
				content: txt,
				config: {
					falafelPlugins: ["export-to-module-exports", require("static-import-to-require")],
					sourceComment: true,
				}
			},
			function (err, transformed) {
				if (err) {
					console.log(err);
					return;
				}
				console.log("----------------");
				console.log(transformed);
			}
		);

		done(false);
	},

};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult !== "function") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('browserify_falafel_tool', function () { for (var i in module.exports) { it(i, module.exports[i]).timeout(5000); } });
