'use strict';

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

	appendJSON (base, file, data) {
		var json = JSON.parse (base.fs.read (file));

		Object.assign (json, data);
		base.fs.write (file, JSON.stringify (json, '', '\t'));
	}
};
