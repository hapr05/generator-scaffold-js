/**
 * File editors
 * @namespace util.editors
 */
'use strict';

/**
 * Finds a line in an array
 * @function util.editors.find
 * @private
 * @param {Array} array - the file contents
 * @param {String} string - the string to find
 * @param {Number} start - starting offset
 * @returns {Number} the index or array.length if not found
 */
const find = (array, string, start) => {
	var i;

	for (i = start; i < array.length; i++) {
		if (-1 !== array [i].indexOf (string)) {
			break;
		}
	}

	return i;
};

module.exports = {
	/**
	 * Appends a line inside a a HTML element
	 * @function util.editors.appendHtml
	 * @param {yeoman.Base} base - the generator interface
	 * @param {String} file - file name to modify
	 * @param {String} open - the opening tag
	 * @param {String} close - the closing tag
	 * @param {String} data - the HTML to insert
	 * @throws {Error} throws an error if the insertion point is not found
	 */
	appendHtml (base, file, open, close, data) {
		var html = base.fs.read (file).split ('\n'),
			indented,
			i = find (html, open, 0),
			j = find (html, close, i);

		if (j >= html.length) {
			throw new Error (`Failed to find insertion point for ${ data } in %{ file }`);
		}

		indented = /^\s*/.exec (html [j - 1]) [0] + data;
		if (indented !== html [j - 1]) {
			if (j === i + 1) {
				html.splice (j, 0, indented);
			} else {
				html.splice (j, 0, '', indented);
			}
			base.fs.write (file, html.join ('\n'));
		}
	},

	/**
	 * Appends data to a JSON file
	 * @function util.editors.appendJSON
	 * @param {yeoman.Base} base - the generator interface
	 * @param {String} file - file name to modify
	 * @param {Object} data - the data to append
	 */
	appendJSON (base, file, data) {
		var json = JSON.parse (base.fs.read (file));

		Object.assign (json, data);
		base.fs.write (file, JSON.stringify (json, '', '\t'));
	}
};
