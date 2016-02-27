(function (require) {
	'use strict';

	var gulp = require ('gulp'),
		jshint = require ('gulp-jshint'),
		opts = {
			indexSrc: 'index.js'
		};

	gulp.task ('default', [ 'serve' ]);
	gulp.task ('serve', [ 'js.lint' ]);
	gulp.task ('ci', [ 'js.lint' ]);

	/* JavaScript tasks */
	(function () {
		gulp.task ('js.lint', function () {
			return gulp.src ([
				opts.indexSrc
			]).pipe (jshint ());
		});
		
		gulp.task ('js', [ 'js.lint' ]);
	}) ();

}) (require);
