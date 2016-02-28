(function (require) {
	'use strict';

	const gulp = require ('gulp'),
		//debug = require ('gulp-debug'),
		jshint = require ('gulp-jshint'),
		mocha = require ('gulp-mocha'),
		istanbul = require ('gulp-istanbul'),
		opts = {
			js: {
				'gulpfile': 'gulpfile.js',
				'app': 'app/**/*.js',
				'appnt': '!app/**/-*.js',
				'test': 'test/**/*.js'
			}
		};

	gulp.task ('default', [ 'ci' ]);
	gulp.task ('ci', [ 'js', 'test' ]);

	gulp.task ('watch', () => {
		gulp.watch ([
			opts.js.gulpfile,
			opts.js.app,
			opts.js.test
		], [ 'js', 'test' ]);
	});

	/* Unit testing tasks */
	(function () {
		gulp.task ('test.init', () => {
			return gulp.src ([
				opts.js.app,
				opts.js.appnt
			]).pipe (istanbul ({
				includeUntested: true
			})).pipe (istanbul.hookRequire ());
		});

		gulp.task ('test', [ 'test.init' ], () => {
			return gulp.src (opts.js.test).pipe (mocha ({
				ui: 'bdd',
				reporter: 'spec'
			})).pipe (istanbul.writeReports ({
				dir: './coverage/',
				reporters: [
					'html',
					'json',
					'lcov',
					'text'
				]
			})).pipe (istanbul.enforceThresholds ({
				thresholds: {
					global: 100
				}
			}));
		});
	} ());

	/* JavaScript tasks */
	(function () {
		gulp.task ('js.lint', () => {
			return gulp.src ([
				opts.js.gulpfile,
				opts.js.app,
				opts.js.appnt,
				opts.js.test
			]).pipe (jshint ()).pipe (jshint.reporter ('default')).pipe (jshint.reporter ('fail'));
		});
		
		gulp.task ('js', [ 'js.lint' ]);
	} ());
} (require));
