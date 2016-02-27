(function (require, module) {
	'use strict';

	const generator = require ('yeoman-generator'),
		path = require ('path');

	module.exports = generator.Base.extend ({
		constructor: function () {
			generator.Base.apply (this, arguments);

			this.argument ('appName', {
				type: String,
				desc: 'In module format. Ex: `hapi-plot-device`',
				required: true
			});
		},

		init: function () {
			this.pkg = this.fs.readJSON (path.join (__dirname, '../package.json'));
		}
	});
} (require, module));
