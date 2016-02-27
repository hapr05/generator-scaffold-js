(function (require) {
	'use strict';

	const gulp = require ('gulp'),
		jshint = require ('gulp-jshint'),
		opts = {
			js: {
				'gulpfile': 'gulpfile.js',
				'app': 'app/**/*.js'
			}
		};

	gulp.task ('default', [ 'serve' ]);
	gulp.task ('serve', [ 'js.lint' ]);
	gulp.task ('ci', [ 'js.lint' ]);

	/* JavaScript tasks */
	(function () {
		gulp.task ('js.lint', function () {
			return gulp.src ([
				opts.js.gulpfile,
				opts.js.app
			]).pipe (jshint ());
		});
		
		gulp.task ('js', [ 'js.lint' ]);
	}) ();

} (require));
