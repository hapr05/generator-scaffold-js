(function () {
	'use strict';

	const gulp = require ('gulp'),
		nodemon = require ('gulp-nodemon'),
		browserSync = require ('browser-sync'),
		jshint = require ('gulp-jshint'),
		jsonlint = require ('gulp-json-lint'),
		mocha = require ('gulp-mocha'),
		concat = require ('gulp-concat'),
		rename = require ('gulp-rename'),
		uglify = require ('gulp-uglify'),
		annotate = require ('gulp-ng-annotate'),
		less = require ('gulp-less'),
		cleancss = require ('gulp-clean-css'),
		jsonminify = require ('gulp-jsonminify'),
		imagemin = require ('gulp-imagemin'),
		templatecache = require ('gulp-angular-templatecache'),
		processhtml = require ('gulp-processhtml'),
		clean = require ('gulp-clean'),
		karma = require ('karma'),
		istanbul = require ('istanbul'),
		checker = require ('istanbul-threshold-checker'),
		gulpIstanbul = require ('gulp-istanbul'),
		fs = require ('fs'),
		path = require ('path'),
		opts= {
			files: {
				html: {
					index: 'src/web/index.html',
					views: 'src/web/app/**/*.html',
					watch: 'src/web/**/*.html'
				},
				js: {
					gulpfile: 'gulpfile.js',
					server: 'src/server/**/*.js',
					serverUnitTest: 'test/unit/server/**/*.js',
					web: 'src/web/app/**/*.js',
					unitTest: 'test/unit/**/*.js'
				},
				less: 'src/web/assets/less/app.less',
				json: {
					all: [ '**/*.json', '!node_modules/**/*.json' ],
					locale: 'src/web/assets/locale/*.json'
				},
				img: 'src/web/assets/img/**.*',
				vendor: {
					js: [
						'src/web/bower_components/es5-shim/es5-shim.js',
						'src/web/bower_components/es6-shim/es6-shim.js',
						'src/web/bower_components/moment/moment.js',
						'src/web/bower_components/jquery/dist/jquery.js',
						'src/web/bower_components/bootstrap/dist/js/bootstrap.js',
						'src/web/bower_components/angular/angular.js',
						'src/web/bower_components/angular-aria/angular-aria.js',
						'src/web/bower_components/angular-cookies/angular-cookies.js',
						'src/web/bower_components/angular-sanitize/angular-sanitize.js',
						'src/web/bower_components/angular-local-storage/dist/angular-local-storage.js',
						'src/web/bower_components/angular-translate/angular-translate.js',
						'src/web/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
						'src/web/bower_components/angular-translate-storage-local/angular-translate-storage-local.js',
						'src/web/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
						'src/web/bower_components/angular-ui-router/release/angular-ui-router.js',
						'src/web/bower_components/angular-bootstrap/ui-bootstrap.js',
						'src/web/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
						'src/web/bower_components/angular-ui-select/dist/select.js',
						'src/web/bower_components/bootstrap-ui-datetime-picker/dist/datetime-picker.js',
						'src/web/bower_components/bootstrap-ui-datetime-picker/dist/datetime-picker.tpls.js',
						'src/web/bower_components/angular-jwt/dist/angular-jwt.js',
						'src/web/bower_components/angular-swagger-ui/dist/scripts/swagger-ui.js'
					],
					css: [
						'src/web/bower_components/bootstrap/dist/css/bootstrap.css',
						'src/web/bower_components/bootstrap/dist/css/bootstrap-theme.css',
						'src/web/bower_components/angular-ui-select/dist/select.css',
						'src/web/bower_components/angular-swagger-ui/dist/css/swagger-ui.css'
					],
					fonts: [
						'src/web/bower_components/bootstrap/dist/fonts/*'
					]
				}
			},
			dist: {
				exclude: '!src/web/app/components/{apidoc,apidoc**}',
				root: 'src/web/dist',
				app: 'src/web/dist/app',
				assets: {
					js: 'src/web/dist/assets/js',
					css: 'src/web/dist/assets/css',
					locale: 'src/web/dist/assets/locale',
					img: 'src/web/dist/assets/img',
					fonts: 'src/web/dist/assets/fonts'
				}
			},
			restart: {
				delay: 500
			}
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

	/* Main tasks */
	(function () {
		gulp.task ('default', [ 'serve' ]);
		gulp.task ('ci', [ 'build', 'test.unit' ], () => {
			/*
			 * This is to handle karma/travis issues where the process doesn't exit.
			 * Only seems to happen on travis but causes the build to fail.
			 * If the dependencies fail the process will still exit with 1.
			 */
			process.exit ();
		});
		gulp.task ('build', [ 'vendor', 'js', 'css', 'json', 'img', 'html' ]);
		gulp.task ('clean', () => {
			gulp.src ([ 'src/web/dist', 'coverage' ], { read: false }).pipe (clean ());
		});
	} ());

	/* Server tasks */
	(function () {
		gulp.task ('serve', [ 'js.lint', 'json.lint', 'test.unit', 'bs' ], () => {
			gulp.watch (opts.files.js.web, [ 'js.lint', 'test.unit', 'bs.reload' ]);
			gulp.watch ([
				opts.files.html.watch,
				opts.files.less,
				opts.files.json.all,
				opts.files.img
			], [ 'bs.reload' ]);
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
		
		gulp.task ('js.concat', () => {
			return gulp.src ([
				opts.files.js.web,
				opts.dist.exclude
			]).pipe (concat ('app.js')).pipe (gulp.dest (opts.dist.app));
		});
		
		gulp.task ('js.uglify', [ 'js.concat' ], () => {
			return gulp.src (path.join (opts.dist.app, 'app.js')).pipe (annotate ()).pipe (uglify ()).pipe (rename ('app.min.js')).pipe (gulp.dest (opts.dist.app));
		});
		
		gulp.task ('js', [ 'js.lint', 'js.uglify' ]);
	} ());

	/* Assset tasks */
	(function () {
		gulp.task ('css.less', () => {
			return gulp.src (opts.files.less).pipe (less ()).pipe (gulp.dest (opts.dist.assets.css));
		});
		
		gulp.task ('css.clean', [ 'css.less' ], () => {
			return gulp.src (path.join (opts.dist.assets.css, 'app.css')).pipe (cleancss ()).pipe (rename ('app.min.css')).pipe (gulp.dest (opts.dist.assets.css));
		});
		
		gulp.task ('css', [ 'css.clean' ]);

		gulp.task ('json.lint', () => {
			return gulp.src (opts.files.json.all).pipe (jsonlint ()).pipe (jsonlint.report ('verbose'));
		});
		
		gulp.task ('json.minify', () => {
			return gulp.src (opts.files.json.locale).pipe (jsonminify ()).pipe (gulp.dest (opts.dist.assets.locale));
		});
		
		gulp.task ('json', [ 'json.lint', 'json.minify' ]);
		
		gulp.task ('img', () => {
			return gulp.src (opts.files.img).pipe (imagemin ()).pipe (gulp.dest (opts.dist.assets.img));
		});
	} ());

	/* HTML taskts */
	(function () {
		gulp.task ('html.templatecache', () => {
			return gulp.src ([
				opts.files.html.views,
				opts.dist.exclude
			]).pipe (processhtml ()).pipe (templatecache ({
				filename: 'app.tpl.js',
				module: '<%= appSlug %>',
				base: path.join (__dirname, 'src/web')
			})).pipe (gulp.dest (opts.dist.app));
		});

		gulp.task ('html.templatecache.uglify', [ 'html.templatecache' ], () => {
			return gulp.src (path.join (opts.dist.app, 'app.tpl.js')).pipe (annotate ()).pipe (uglify ()).pipe (rename ('app.tpl.min.js')).pipe (gulp.dest (opts.dist.app));
		});
		
		gulp.task ('html.process', () => {
			return gulp.src (opts.files.html.index).pipe (processhtml ()).pipe (gulp.dest (opts.dist.root));
		});

		gulp.task ('html', [ 'html.templatecache.uglify', 'html.process' ]);
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
			return gulp.src (opts.files.js.serverUnitTest).pipe (mocha ({
				ui: 'bdd',
				reporter: 'spec'
			})).pipe (gulpIstanbul.writeReports ({
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
				configFile: path.join (__dirname, 'karma.conf.js'),
				singleRun: true
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

	/* Vendor tasks */
	(function () {
		gulp.task ('vendor.js.concat', () => {
			return gulp.src (opts.files.vendor.js).pipe (concat ('vendor.js')).pipe (gulp.dest (opts.dist.assets.js));
		});
		
		gulp.task ('vendor.js.uglify', [ 'vendor.js.concat' ], () => {
			return gulp.src (path.join (opts.dist.assets.js, 'vendor.js')).pipe (annotate ()).pipe (rename ('vendor.min.js')).pipe (gulp.dest (opts.dist.assets.js));
		});
		
		gulp.task ('vendor.css.concat', () => {
			return gulp.src (opts.files.vendor.css).pipe (concat ('vendor.css')).pipe (gulp.dest (opts.dist.assets.css));
		});
		
		gulp.task ('vendor.css.clean', [ 'vendor.css.concat' ], () => {
			return gulp.src (path.join (opts.dist.assets.css, 'vendor.css')).pipe (cleancss ()).pipe (rename ('vendor.min.css')).pipe (gulp.dest (opts.dist.assets.css));
		});
		
		gulp.task ('vendor.fonts', () => {
			return gulp.src (opts.files.vendor.fonts).pipe (gulp.dest (opts.dist.assets.fonts));
		});
		
		gulp.task ('vendor', [ 'vendor.js.uglify', 'vendor.css.clean', 'vendor.fonts' ]);
	} ());
} ());
