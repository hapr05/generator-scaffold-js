(function () {
	'use strict';

	const assert = require ('yeoman-assert'),
		helpers = require ('yeoman-test'),
		path = require ('path'),
		name = 'name-x';

	before (function (done) {
		helpers.run (path.join ( __dirname, '../../app')).withArguments ([ name ]).on ('end', done);
	});

	describe ('oldschool:app', function () {
		it ('should generate project directory', function () {
			assert.file (name);
		});

		describe ('.gitignore', function () {
			it ('should generate .gitignore', function () {
				assert.file (name + '/.gitignore');
			});
			it ('should contain node_modules', function () {
				assert.fileContent (name + '/.gitignore', 'node_modules');
			});
			it ('should contain coverage', function () {
				assert.fileContent (name + '/.gitignore', 'coverage');
			});
		});
	});
} ());
