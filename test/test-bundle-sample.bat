
chcp 65001

set nodeModulesPath=../node_modules
set browserifyPath=%nodeModulesPath%/.bin/browserify

set dest=./bundle/sample-bundle.js

"%browserifyPath%" ^
	-o %dest% ^
	-v ^
	-g [ "../browserify-falafel-tool" --falafelPlugins [ export-to-module-exports static-import-to-require ] --sourceComment --debugInfo ] ^
	-r ./sample/sample.js:sample
