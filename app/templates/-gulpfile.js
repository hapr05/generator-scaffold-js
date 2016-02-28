(function (require) {
	'use strict';

	const gulp = require ('gulp'),
		jshint = require ('gulp-jshint'),
		jsonlint = require ('gulp-json-lint'),
		opts = {
			js: {
				'gulpfile': 'gulpfile.js'
			},
			json: [
				'package.json',
				'app/**/*.json'
			]
		};

	function values (obj) {
		var v = [], k;
		for (k in obj) {
			if (obj.hasOwnProperty (k)) {
				v.push (obj [k]);
			}
		}
		return v;
	}

	gulp.task ('default', [ 'serve' ]);

	gulp.task ('serve', [ 'js.lint', 'json.lint' ], () => {
	});

	/* JavaScript tasks */
	(function () {
		gulp.task ('js.lint', () => {
			return gulp.src (values (opts.js)).pipe (jshint ()).pipe (jshint.reporter ('jshint-stylish')).pipe (jshint.reporter ('fail'));
		});
		
		gulp.task ('js', [ 'js.lint' ]);
	} ());

	/* Json tasks */
	(function () {
		gulp.task ('json.lint', () => {
			return gulp.src (opts.json).pipe (jsonlint ()).pipe (jsonlint.report ('verbose'));
		});
		
		gulp.task ('json', [ 'json.lint' ]);
	} ());
} (require));
