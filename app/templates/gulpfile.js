(function (require) {
	'use strict';

	const gulp = require ('gulp'),
		nodeMon = require ('gulp-nodemon'),
		browserSync = require ('browser-sync'),
		jsHint = require ('gulp-jsHint'),
		jsonLint = require ('gulp-json-lint'),
		opts= {
			files: {
				html: 'src/web/index.html',
				js: {
					'gulpfile': 'gulpfile.js',
					'server': 'src/server/**/*.js',
					'web': 'src/web/**/*.js'
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
	gulp.task ('ci', [ 'js.lint', 'json.lint' ]);

	/* Server tasks */
	(function () {
		gulp.task ('serve', [ 'js.lint', 'json.lint', 'bs' ], () => {
			gulp.watch (opts.files.js.web, [ 'js.lint', 'bs.reload' ]);
			gulp.watch (opts.files.html, [ /* 'html', */ 'bs.reload' ]);
		});

		gulp.task ('nodemon', (done) => {
			return nodeMon ({
				script: 'src/server',
				watch: opts.files.js.server
			}).on ('start', done).on ('restart', () => {
				setTimeout (() => {
					browserSync.reload ();
				}, opts.restart.delay);
			});
		});

		gulp.task ('bs', [ 'nodemon' ], () => {
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
			return gulp.src (values (opts.files.js)).pipe (jsHint ()).pipe (jsHint.reporter ('jsHint-stylish')).pipe (jsHint.reporter ('fail'));
		});
		
		gulp.task ('js', [ 'js.lint' ]);
	} ());

	/* Json tasks */
	(function () {
		gulp.task ('json.lint', () => {
			return gulp.src (opts.files.json).pipe (jsonLint ()).pipe (jsonLint.report ('verbose'));
		});
		
		gulp.task ('json', [ 'json.lint' ]);
	} ());
} (require));
