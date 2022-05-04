
//browserify-falafel-tool @ npm, browserify transform tool by sharing falafel.

var browserify_transform_tools = require('browserify-transform-tools');
var falafel = require('falafel');

/*
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
*/

module.exports = browserify_transform_tools.makeStringTransform(
	"browserify-falafel-tool", { jsFilesOnly: true },
	function (content, transformOptions, done) {
		var falafelPlugins = transformOptions?.config?.falafelPlugins;

		//`_`: refer `subarg`/`minimist` from `browserify`
		if (falafelPlugins?._ && (falafelPlugins._ instanceof Array))
			falafelPlugins = transformOptions.config.falafelPlugins = falafelPlugins._;	//fully replace it

		var falafelOptions = {};

		if (!falafelPlugins || !(falafelPlugins instanceof Array)) { done(null, content); return; }

		var i, imax = falafelPlugins.length, plugin, cbo, cboArray = [], pluginOptions;
		for (i = 0; i < imax; i++) {
			plugin = falafelPlugins[i];
			if (typeof plugin === "string") plugin = require(plugin);

			if (!plugin.falafelCallback) continue;
			if (plugin.fastCheck && !plugin.fastCheck(content)) continue;

			cbo = plugin.falafelCallback(content, transformOptions?.config);
			if (!cbo?.node) continue;
			cboArray.push(cbo);

			pluginOptions = plugin.defaultFalafelOptions;
			if (pluginOptions) Object.assign(falafelOptions, pluginOptions);
		}
		imax = cboArray.length;
		if (!(imax > 0)) { done(null, content); return; }

		//options from config will cover those from plugins
		var configFalafelOptions = transformOptions?.config?.falafelOptions;
		if (configFalafelOptions) Object.assign(falafelOptions, configFalafelOptions);

		var newContent = falafel(content, falafelOptions,
			function (node) {
				for (i = 0; i < imax; i++) {
					cboArray[i].node(node);
				}
			}
		).toString();

		for (i = 0; i < imax; i++) {
			if (cboArray[i].final) newContent = cboArray[i].final(newContent);
		}

		if (transformOptions?.config?.debugInfo && newContent !== content)
			console.log("transfered " + transformOptions?.file)

		done(null, newContent);
	}
);
