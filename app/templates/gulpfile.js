(function () {
	'use strict';

	const gulp = require ('gulp'),
		nodemon = require ('gulp-nodemon'),
		browserSync = require ('browser-sync'),
		jshint = require ('gulp-jshint'),
		jsonlint = require ('gulp-json-lint'),
		mocha = require ('gulp-mocha'),
		karma = require ('karma'),
		istanbul = require ('istanbul'),
		checker = require ('istanbul-threshold-checker'),
		gulpIstanbul = require ('gulp-istanbul'),
		es = require ('event-stream'),
		fs = require ('fs'),
		path = require ('path'),
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
		gulp.task ('test.unit.server.init', () => {
			return gulp.src ([
				opts.files.js.server,
				opts.files.js.web
			]).pipe (gulpIstanbul ({
				includeUntested: true
			})).pipe (gulpIstanbul.hookRequire ());
		});

		gulp.task ('test.unit.server', [ 'test.unit.server.init' ], () => {
			return es.merge (gulp.src (opts.files.js.serverUnitTest).pipe (mocha ({
				ui: 'bdd',
				reporter: 'spec'
			}))).pipe (gulpIstanbul.writeReports ({
				reporters: [
					'json'
				],
				reportOpts: {
					json: { dir: 'coverage', file: 'server.coverage.json' }
				}
			}))/*.pipe (gulpIstanbul.enforceThresholds ({
				thresholds: {
					global: 100
				}
			}))*/;
		});

		gulp.task ('test.unit.web', (done) => {
			new karma.Server ({
				configFile: path.join (__dirname, 'karma.conf.js')
			}, done).start ();
		});

		gulp.task ('test.unit', [ 'test.unit.server', 'test.unit.web' ], (done) => {
			const collector = new istanbul.Collector (),
				reporter = new istanbul.Reporter ();

			collector.add (JSON.parse (fs.readFileSync ('coverage/server.coverage.json', 'utf8')));
			collector.add (JSON.parse (fs.readFileSync ('coverage/web.coverage.json', 'utf8')));
			reporter.addAll ( ['html', 'json', 'lcov', 'text' ]);
			reporter.write (collector, false, () => {
				done (checker.checkFailures ({ global: 100 }, collector.getFinalCoverage ()).every ((t) => {
					return !(t.global.failed || t.each && t.each.failed);
				}) ? undefined : 'Failed to meet coverage thresholds!');
			});
		});
	} ());
} ());
