(function (require, module) {
	'use strict';

	const generator = require ('yeoman-generator'),
		path = require ('path'),
		mkdirp = require('mkdirp');

	module.exports = generator.Base.extend ({
		constructor: function () {
			generator.Base.apply (this, arguments);

			this.argument ('appName', {
				type: String,
				desc: 'In module format. Ex: `hapi-plot-device`',
				required: true
			});
		},

		init () {
			this.pkg = this.fs.readJSON (path.join (__dirname, '../package.json'));
		},

		app () {
			mkdirp.sync (this.appName);

			this.copy ('-gitignore', path.join (this.appName, '.gitignore'));

		}
	});
} (require, module));
