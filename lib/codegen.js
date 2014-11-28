var fs = require("fs");
var path_ = require("path");
var underscore = require("underscore");
var utils = require("./utils");
require("./proto/Object");
require("./proto/String");

/**
 * Compiled templates keyed by path.
 */
var templates = {};

var options = {
	templateBase: "",
	outputBase: ""
};

/**
 * Gets the content of the given file.
 *
 * @param {string} path The file path.
 */
function getContent(path) {
	return fs.existsSync(path) ? fs.readFileSync(path, "utf-8") : null;
}

/**
 * Gets a compiled template.
 *
 * @param {string} path The template path.
 */
function getTemplate(path) {
	var template = templates[path];
	if (!template) {
		var path2 = path_.join(options.templateBase, path);
		template = underscore.template(getContent(path2));
		templates[path] = template;
	}
	return template;
}

/**
 * Copies a file or directory from the template path into the output directory.
 *
 * @param {string} templatePath The file or directory in the template path.
 * @param {string} [outputPath] The file or directory in the output path. If not specified it'll be the same as the templatePath parameter.
 */
function copy(templatePath, outputPath) {
	if (!outputPath) outputPath = templatePath;

	var template = path_.join(options.templateBase, templatePath);
	var output = path_.join(options.outputBase, outputPath);

	// Creates the output directory if needed
	utils.mkdirsSync(output);

	// Copies all the files and directories
	_copy(template, output);
}

/**
 * Merges some data object into one/many templates to generate one/many outputs.
 * Different combinations are accepted.
 * If the outputs is not specified the same names as the templates are used.
 *
 * @param {object} data The data object.
 * @param {string,string[],object} templates The template path(s).
 * @param {string,string[]} [outputs] The output path(s).
 */
function merge(data, templates, outputs) {
	// Add options to simulate

	if (typeof templates === "string") {

		if (!outputs || typeof outputs === "string") {

			// One template to generate one output
			_merge(data, templates, outputs);

		} else if (typeof outputs === "object" && Array.isArray(outputs)) {

			// One template to generate multiple outputs
			outputs.forEach(function (output) {
				merge(data, templates, output);
			});
		}

	} else if (typeof templates === "object") {

		if (Array.isArray(templates)) {

			// Multiple templates (array) to generate one or more outputs
			templates.forEach(function (template) {
				merge(data, template, outputs);
			});

		} else {
			// Multiple templates (object) to generate one or more outputs
			Object.keys(templates).forEach(function (name) {
				merge(data, name, templates[name])
			});
		}
	}
}

function _copy(src, dest, options) {
	// TODO - Overwrite flag, recursive flag, check differences (contents, md5, date) options, includes, excludes

	// Ignore template files
	if (dest.endsWith(".template") || dest.endsWith(".template.js")) {
		return;
	}

	var srcExists = fs.existsSync(src);
	var srcStats = srcExists && fs.statSync(src);

	var destExists = fs.existsSync(dest);
	var destStats = destExists && fs.statSync(dest);

	if (srcExists && srcStats.isDirectory()) {
		if (!destExists) {
			console.log("Generated '" + dest + "'");
			fs.mkdirSync(dest);
		}

		fs.readdirSync(src).forEach(function(filename) {
			_copy(path_.join(src, filename), path_.join(dest, filename));
		});

	} else if (!destExists) {
		console.log("Generated '" + dest + "'");
		fs.linkSync(src, dest);

	} else if (srcStats.mtime.getTime() > destStats.mtime.getTime()) {
		console.log("Generated '" + dest + "'");
		fs.unlinkSync(dest);
		fs.linkSync(src, dest);
	}
}

/**
 * Merges a data object into a template to generate an output file.
 *
 * @param {string} templatePath The template path.
 * @param {object} data The data object.
 * @param {string} [outputPath] The output path. If not specified it'll be the same as the template path but in the output directory.
 */
function _merge(data, templatePath, outputPath) {

	//var templateStats = fs.statSync(templatePath);
	//if (templateStats.isDirectory()) {
	//	mergeProject(data, templatePath, outputPath);
	//} else {
		mergeFile(data, templatePath, outputPath);
	//}
}

function mergeProject(data, templatePath, outputPath) {
	var templateFile = path.resolve(".", path.join(templatePath, "codegen.template.js"));
	var template = require(templateFile);
	template(module.exports, data);
}

function mergeFile(data, templatePath, outputPath) {

	if (!outputPath) outputPath = templatePath;
	templatePath = templatePath + ".template";

	try {
		var template = getTemplate(templatePath);
		var outputFile = path_.join(options.outputBase, outputPath);

		var oldContent = getContent(outputFile);
		var newContent = template(data);

		// Only writes the output file if it's new or different
		if (newContent !== oldContent) {
			var outputDir = path_.dirname(outputFile);

			utils.mkdirsSync(outputDir);
			fs.writeFileSync(outputFile, newContent);
			console.log("Generated '" + outputPath + "'");
		}
	} catch (e) {
		console.log("Error generating '" + outputPath + "' (template = '" + templatePath + "')", e.stack);
	}
}

/**
 * Configures the code generator.
 *
 * @param {object} newOptions The new options.
 */
function configure(newOptions) {
	if (newOptions.templateBase) {
		options.templateBase = newOptions.templateBase;
	}
	if (newOptions.outputBase) {
		options.outputBase = newOptions.outputBase;
	}
}

exports.configure = configure;
exports.copy = copy;
exports.merge = merge;
