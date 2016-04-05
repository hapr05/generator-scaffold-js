'use strict';

const gulp = require ('gulp'),
	gutil = require ('gulp-util'),
	istanbul = require ('gulp-istanbul'),
	jscs = require ('gulp-jscs'),
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
	spawn = require ('child_process').spawn,
	values = obj => {
		var v = [],
			k;

		for (k in obj) {
			if (obj.hasOwnProperty (k)) {
				v.push (obj [ k ]);
			}
		}
		return v;
	};

gulp.task ('default', [ 'js', 'json', 'test.unit' ]);
gulp.task ('ci', [ 'js', 'json', 'test' ]);

gulp.task ('watch', () => {
	gulp.watch ([
		opts.files.js.gulpfile,
		opts.files.js.app,
		opts.files.js.unitTest
	], [ 'js', 'test.unit' ]);
});

/* Unit testing tasks */
(() => {
	gulp.task ('test.init', () => gulp.src ([
		opts.files.js.app,
		opts.files.js.appnt,
		opts.files.js.util
	]).pipe (istanbul ({
		includeUntested: true
	})).pipe (istanbul.hookRequire ()));

	gulp.task ('test.unit', [ 'test.init' ], () => gulp.src (opts.files.js.unitTest).pipe (mocha ({
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
	})));

	gulp.task ('test.integration', done => {
		var test = spawn ('node', [ 'test/integration/run.js' ]).on ('close', code => {
			if (code) {
				throw new Error ('integration test failed');
			}
			done ();
		});

		test.stdout.setEncoding ('utf8');
		test.stdout.on ('data', data => {
			gutil.log (data);
		});

		test.stderr.setEncoding ('utf8');
		test.stderr.on ('data', data => {
			gutil.log (gutil.colors.red (data));
			gutil.beep ();
		});
	});

	gulp.task ('test', [ 'test.unit', 'test.integration' ]);
}) ();

/* JavaScript tasks */
(() => {
	gulp.task ('js.lint', () => gulp.src (values (opts.files.js)).pipe (jshint ()).pipe (jshint.reporter ('jshint-stylish')).pipe (jshint.reporter ('fail')));

	gulp.task ('js.jscs', () => gulp.src (values (opts.files.js)).pipe (jscs ({
		esnext: true,
		verbose: true
	})).pipe (jscs.reporter ()).pipe (jscs.reporter ('fail')));

	gulp.task ('js', [ 'js.lint', 'js.jscs' ]);
}) ();

/* Json tasks */
(() => {
	gulp.task ('json.lint', () => gulp.src (opts.files.json).pipe (jsonlint ()).pipe (jsonlint.report ('verbose')));

	gulp.task ('json', [ 'json.lint' ]);
}) ();
