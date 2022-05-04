# browserify-falafel-tool
browserify transform tool by sharing falafel

# Install
```
npm install browserify-falafel-tool
```

# Plugin interface
```javascript
//The exports of a falafel plugins for this module:
	
	exports.fastCheck = function (source){...}	//optional
		//to check if a source should be transfered by this plugin;

	exports.falafelCallback = function (source, options){	//required
		...
		//return callback object
		return {
			node: function(node){...},		//required
				//for falafel node iteration, refer falafel;

			final: function(result){...}		//optional
				//for final result;
				//return new result;
		}
	}

	exports.defaultFalafelOptions	//optional
		//a config object to passed to falafel;

```

# Usage in command line
```shell

browserify ... -g [ "browserify-falafel-tool" ^
	--falafelPlugins [ my-plugin-1 my-plugin-2 ] --debugInfo ] ...

# or with appliesTo.files/includeExtensions/excludeExtensions for browserify-transform-tools;
# default appliesTo.jsFilesOnly;

	-g [ "browserify-falafel-tool" ... --appliesTo [ --files my.js --files my2.js ] ]

	-g [ "browserify-falafel-tool" ... --appliesTo [ --includeExtensions .js --includeExtensions .js ] ]

# !!! NOTE: 2 or more items to overcome bug from 'browserify-transform-tools' in command line.

# or in Linux shell
	-g [ "browserify-falafel-tool" ... --appliesTo.includeExtensions { .js .mjs } ]

```

# Usage in code
```javascript
var browserify_transform_tools = require('browserify-transform-tools');
var browserify_falafel_tool = require("browserify-falafel-tool");

browserify_transform_tools.runTransform(browserify_falafel_tool, sampleFile,
	{
		content: txt,
		config: {
			falafelPlugins: ["my-plugin-1", require("my-plugin-2")],	//module name or object
			debugInfo: true,
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

```

# Known problem/limitation

* if two plugins process same kind of falafel nodes, the result is unpredictable;
