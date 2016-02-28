(function (require) {
	'use strict';

	const gulp = require ('gulp'),
		//debug = require ('gulp-debug'),
		jshint = require ('gulp-jshint'),
		mocha = require ('gulp-mocha'),
		istanbul = require ('gulp-istanbul'),
		spawn = require ('child_process').spawn,
		opts = {
			js: {
				'gulpfile': 'gulpfile.js',
				'app': 'app/**/*.js',
				'appnt': '!app/**/-*.js',
				'unitTest': 'test/unit/**/*.js',
				'integrationTest': 'test/integration/**/*.js'
			}
		};

	gulp.task ('default', [ 'ci' ]);
	gulp.task ('ci', [ 'js', 'test.unit', 'test.integration' ]);

	gulp.task ('watch', () => {
		gulp.watch ([
			opts.js.gulpfile,
			opts.js.app,
			opts.js.unitTest
		], [ 'js', 'test.unit' ]);
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

		gulp.task ('test.unit', [ 'test.init' ], () => {
			return gulp.src (opts.js.unitTest).pipe (mocha ({
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

		gulp.task ('test.integration', (done) => {
			spawn ('node', [ 'test/integration/run.js' ]).on ('close', (code) => {
				if (code) {
					throw 'integration test failed';
				}
				done ();
			});
		});
	} ());

	/* JavaScript tasks */
	(function () {
		gulp.task ('js.lint', () => {
			return gulp.src ([
				opts.js.gulpfile,
				opts.js.app,
				opts.js.appnt,
				opts.js.unitTest,
				opts.js.integrationTest
			]).pipe (jshint ()).pipe (jshint.reporter ('default')).pipe (jshint.reporter ('fail'));
		});
		
		gulp.task ('js', [ 'js.lint' ]);
	} ());
} (require));
