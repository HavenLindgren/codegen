#!/usr/bin/env node

var codegen = require("./codegen");
var fs = require("fs");
var path = require("path");
var yaml = require("js-yaml");

if (process.argv.length != 5) {
	console.log("usage: codegen <data> <template> <output>");
	process.exit(1);
	return;
}

var dataPath = process.argv[2];
var templateBase = process.argv[3];
var outputBase = process.argv[4];

//var templatesPath = "templates/angular.tmpl";
//var dataPath = "data/project.yaml";
//

var data = yaml.safeLoad(fs.readFileSync(dataPath));

// Configures the code generator
codegen.configure({
	templateBase: templateBase,
	outputBase: outputBase
});

//codegen.merge(data, ".", ".");

var templateFile = path.resolve(".", path.join(templateBase, "codegen.template.js"));
var template = require(templateFile);

template(codegen, data);

//codegen.merge(data, "", "");