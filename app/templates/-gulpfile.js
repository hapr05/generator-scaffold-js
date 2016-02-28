(function (require) {
	'use strict';

	const gulp = require ('gulp'),
		jshint = require ('gulp-jshint'),
		opts = {
			js: {
				'gulpfile': 'gulpfile.js'
			}
		};

	gulp.task ('default', [ 'serve' ]);

	gulp.task ('serve', [ 'js.lint' ], () => {
	});

	/* JavaScript tasks */
	(function () {
		gulp.task ('js.lint', () => {
			return gulp.src ([
				opts.js.gulpfile
			]).pipe (jshint ()).pipe (jshint.reporter ('default')).pipe (jshint.reporter ('fail'));
		});
		
		gulp.task ('js', [ 'js.lint' ]);
	} ());
} (require));
