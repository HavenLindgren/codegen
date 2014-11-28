/**
 * Removes leading and trailing spaces.
 */
String.prototype.trim = function trim() {
	return this.replace(/^\s+|\s+$/g, "");
};

/**
 * Capitalizes the string.
 */
String.prototype.capitalize = function capitalize() {
	return this[0].toUpperCase() + this.substring(1);
};

/**
 * Decapitalizes the string.
 */
String.prototype.decapitalize = function decapitalize() {
	return this[0].toLowerCase() + this.substring(1);
};

/**
 * Converts a camel-cased string (eg. TheSnakeAteTheCamel) into snake-case (eg. the-snake-ate-the-camel)
 */
String.prototype.dasherize = function dasherize() {
	return this.replace(/.([A-Z])/g, function (s, p1) { return s[0] + "-" + p1.toLowerCase() }).decapitalize();
};

/**
 * Underscores the string.
 */
String.prototype.underscore = function underscore() {
	return this.replace(/.([A-Z])/g, function (s, p1) { return s[0] + "_" + p1.toLowerCase() }).decapitalize();
};

/**
 * Tests if this string starts with the specified prefix.
 *
 * @param {String} prefix The prefix.
 * @return {boolean} true if this string starts with the specified prefix; false otherwise.
 */
String.prototype.startsWith = function startsWith(prefix) {
	return this.indexOf(prefix) === 0;
};

/**
 * Tests if this string ends with the specified suffix.
 *
 * @param {String} suffix The suffix.
 * @return {boolean} true if this string ends with the specified suffix; false otherwise.
 */
String.prototype.endsWith = function endsWith(suffix) {
	var t = String(suffix);
	var index = this.lastIndexOf(t);
	return (index >= 0) && (index === this.length - t.length);
};
