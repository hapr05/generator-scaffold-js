(function (require) {
	'use strict';

	const gulp = require ('gulp'),
		// debug = require ('gulp-debug'),
		gutil = require ('gulp-util'),
		istanbul = require ('gulp-istanbul'),
		jshint = require ('gulp-jshint'),
		jsonlint = require ('gulp-json-lint'),
		mocha = require ('gulp-mocha'),
		opts = {
			files: {
				js: {
					'gulpfile': 'gulpfile.js',
					'app': 'app/**/*.js',
					'appnt': '!app/templates/**/*.js',
					'util': 'util/**/*.js',
					'unitTest': 'test/unit/**/*.js',
					'integrationTest': 'test/integration/**/*.js'
				},
				json: [
					'package.json',
					'app/**/*.json'
				]
			}
		},
		spawn = require ('child_process').spawn;

	function values (obj) {
		var v = [], k;

		for (k in obj) {
			if (obj.hasOwnProperty (k)) {
				v.push (obj [k]);
			}
		}
		return v;
	}

	gulp.task ('default', [ 'ci' ]);
	gulp.task ('ci', [ 'js', 'json', 'test.unit', 'test.integration' ]);

	gulp.task ('watch', () => {
		gulp.watch ([
			opts.files.js.gulpfile,
			opts.files.js.app,
			opts.files.js.unitTest
		], [ 'js', 'test.unit' ]);
	});

	/* Unit testing tasks */
	(function unit () {
		gulp.task ('test.init', () => {
			return gulp.src ([
				opts.files.js.app,
				opts.files.js.appnt,
				opts.files.js.util
			]).pipe (istanbul ({
				includeUntested: true
			})).pipe (istanbul.hookRequire ());
		});

		gulp.task ('test.unit', [ 'test.init' ], () => {
			return gulp.src (opts.files.js.unitTest).pipe (mocha ({
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
			var test = spawn ('node', [ 'test/integration/run.js' ]).on ('close', (code) => {
				if (code) {
					throw new Error ('integration test failed');
				}
				done ();
			});

			test.stdout.setEncoding ('utf8');
			test.stdout.on ('data', (data) => {
				gutil.log (data);
			});

			test.stderr.setEncoding ('utf8');
			test.stderr.on ('data', (data) => {
				gutil.log (gutil.colors.red (data));
				gutil.beep ();
			});
		});
	} ());

	/* JavaScript tasks */
	(function js () {
		gulp.task ('js.lint', () => {
			return gulp.src (values (opts.files.js)).pipe (jshint ()).pipe (jshint.reporter ('jshint-stylish')).pipe (jshint.reporter ('fail'));
		});

		gulp.task ('js', [ 'js.lint' ]);
	} ());

	/* Json tasks */
	(function json () {
		gulp.task ('json.lint', () => {
			return gulp.src (opts.files.json).pipe (jsonlint ()).pipe (jsonlint.report ('verbose'));
		});
		 
		gulp.task ('json', [ 'json.lint' ]);
	} ());
} (require));
