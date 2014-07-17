var fs = require("fs");
var path_ = require("path");
var underscore = require("underscore");
var utils = require("./utils");
require("./proto/String");

var templates = {};

var templateBase = "";
var outputBase = "";

function configure(config) {
	templateBase = config.templateBase;
	outputBase = config.outputBase;
}

/**
 * Gets the content of the given file.
 */
function getContent(path) {
	return fs.existsSync(path) ? fs.readFileSync(path, "utf-8") : null;
}

/**
 * Gets a compiled template from a given file.
 */
function getTemplate(path) {
	var template = templates[path];
	if (!template) {
		var path2 = path_.join(templateBase, path);
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
	if (!outputPath) {
		outputPath = templatePath;
	}
	_copy(path_.join(templateBase, templatePath), path_.join(outputBase, outputPath));
}

function _copy(src, dest, options) {
	// TODO - Overwrite, check contents options

	// Ignore template files
	if (dest.endsWith(".template") || dest.endsWith(".template.js")) {
		return;
	}

	var srcExists = fs.existsSync(src);
	var srcStats = srcExists && fs.statSync(src);

	var destExists = fs.existsSync(dest);

	if (srcExists && srcStats.isDirectory()) {
		if (!destExists) {
			console.log("Generating " + dest);
			fs.mkdirSync(dest);
		}

		fs.readdirSync(src).forEach(function(filename) {
			_copy(path_.join(src, filename), path_.join(dest, filename));
		});

	} else if (!destExists) {
		console.log("Generating " + dest);
		fs.linkSync(src, dest);
	}
}

function merge(data, template, output) {
	if (typeof template === "string") {

		if (!output || typeof output === "string") {
			// 1 template -> 1 output
			_merge(data, template, output);

		} else if (typeof output === "object" && Array.isArray(output)) {
			// 1 template -> Multiple outputs (array)
			output.forEach(function (output) {
				merge(data, template, output);
			});
		}

	} else if (typeof template === "object") {

		if (Array.isArray(template)) {
			// Multiple templates (array) -> Any output
			template.forEach(function (template) {
				merge(data, template, output);
			});

		} else {
			// Multiple templates (object) -> Any output
			Object.keys(template).forEach(function (name) {
				merge(data, name, template[name])
			});
		}
	}
}

/**
 * Merges tone  data into a template into the output directory.
 *
 * @param {string} templatePath The template path.
 * @param {object} data The data object.
 * @param {string} [outputPath] The output path. If not specified it'll be the same as the template path but in the output directory.
 */
function _merge(data, templatePath, outputPath) {
	if (!outputPath) outputPath = templatePath;
	templatePath = templatePath + ".template";

	try {
		var template = getTemplate(templatePath);

		var outputFile = path_.join(outputBase, outputPath);

		var contentPrev = getContent(outputFile);
		var content = template(data);

		if (content !== contentPrev) {
			var outputDir = path_.dirname(outputFile);

			console.log("Generating " + outputPath);
			utils.mkdirsSync(outputDir);
			fs.writeFileSync(outputFile, content);
		}
	} catch (e) {
		console.log("Error generating " + outputPath, e.stack);
	}
}

exports.configure = configure;
exports.copy = copy;
exports.merge = merge;