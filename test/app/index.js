(function () {
	'use strict';

	const assert = require ('yeoman-assert'),
		helpers = require ('yeoman-test'),
		path = require ('path');

	before (function (done) {
		helpers.run (path.join ( __dirname, '../../app')).withArguments (['name-x']).on ('end', done);
	});

	describe ('oldschool:app', function () {
		it ('should export app', function () {
			assert (true);
		});
	});
} ());
