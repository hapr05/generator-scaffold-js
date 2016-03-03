(function (require) {
	'use strict';

	const gulp = require ('gulp'),
		nodemon = require ('gulp-nodemon'),
		browserSync = require ('browser-sync'),
		jshint = require ('gulp-jshint'),
		jsonlint = require ('gulp-json-lint'),
		mocha = require ('gulp-mocha'),
		istanbul = require ('gulp-istanbul'),
		es = require ('event-stream'),
		opts= {
			files: {
				html: 'src/web/index.html',
				js: {
					'gulpfile': 'gulpfile.js',
					'server': 'src/server/**/*.js',
					'serverUnitTest': 'test/unit/server/**/*.js',
					'web': 'src/web/js/**/*.js',
					'unitTest': 'test/unit/**/*.js'
				},
				json: [
					'package.json',
					'src/**/*.json'
				]
			},
			restartDelay: 500
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
	gulp.task ('ci', [ 'js.lint', 'json.lint', 'test.unit' ]);

	/* Server tasks */
	(function () {
		gulp.task ('serve', [ 'js.lint', 'json.lint', 'test.unit', 'bs' ], () => {
			gulp.watch (opts.files.js.web, [ 'js.lint', 'test.unit', 'bs.reload' ]);
			gulp.watch (opts.files.html, [ /* 'html', */ 'test.unit', 'bs.reload' ]);
		});

		gulp.task ('nm', (done) => {
			return nodemon ({
				script: 'server',
				watch: opts.files.js.server
			}).on ('start', done).on ('restart', () => {
				setTimeout (() => {
					browserSync.reload ();
				}, opts.restart.delay);
			});
		});

		gulp.task ('bs', [ 'nm' ], () => {
			browserSync ({
				proxy: 'localhost:8080'
			});
		});

		gulp.task ('bs.reload', () => {
			browserSync.reload ();
		});
	} ());

	/* JavaScript tasks */
	(function () {
		gulp.task ('js.lint', () => {
			return gulp.src (values (opts.files.js)).pipe (jshint ()).pipe (jshint.reporter ('jshint-stylish')).pipe (jshint.reporter ('fail'));
		});
		
		gulp.task ('js', [ 'js.lint' ]);
	} ());

	/* Json tasks */
	(function () {
		gulp.task ('json.lint', () => {
			return gulp.src (opts.files.json).pipe (jsonlint ()).pipe (jsonlint.report ('verbose'));
		});
		
		gulp.task ('json', [ 'json.lint' ]);
	} ());

	/* Testing */
	(function () {
		gulp.task ('test.unit.init', () => {
			return gulp.src ([
				opts.files.js.server,
				opts.files.js.web
			]).pipe (istanbul ({
				includeUntested: true
			})).pipe (istanbul.hookRequire ());
		});

		gulp.task ('test.unit', [ 'test.unit.init' ], () => {
			return es.merge (gulp.src (opts.files.js.serverUnitTest).pipe (mocha ({
				ui: 'bdd',
				reporter: 'spec'
			}))).pipe (istanbul.writeReports ({
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
} (require));
