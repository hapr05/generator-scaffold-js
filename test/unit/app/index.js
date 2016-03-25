(function () {
	'use strict';

	const assert = require ('yeoman-assert'),
		chai = require ('chai'),
		dirtyChai = require ('dirty-chai'),
		chaiAsPromised = require ('chai-as-promised'),
		expect = chai.expect,
		helpers = require ('yeoman-test'),
		mockery = require ('mockery'),
		path = require ('path'),
		name = 'name-x',
		prompts = {
			cfgName: name,
			cfgDbUrl: 'mongodb://localhost:27017',
			cfgDescription: 'my-description',
			cfgHomepage: 'my-homepage',
			cfgBugs: 'my-issues',
			cfgLicense: 'MIT',
			cfgContribName: 'my-name',
			cfgContribEmail: 'my-email',
			cfgContribUrl: 'my-url',
			cfgRepository: 'my-repository',
			cfgFramework: 'AngularJS',
			cfgSocial: []
		};

	chai.use (chaiAsPromised);
	chai.use (dirtyChai);
	chai.use (function (_chai, utils) {
		_chai.Assertion.addMethod ('existOnFs', function () {
			var obj = utils.flag (this, 'object');
			assert.file (obj);
		});

		_chai.Assertion.addMethod ('content', function (str) {
			var obj = utils.flag (this, 'object');
			assert.fileContent (obj, str);
		});
	});

	describe ('oldschool:app', () => {
		before (() => {
			mockery.enable ({
				warnOnReplace: false,
				warnOnUnregistered: false,
				useCleanCache: true
			});

			mockery.registerMock ('./db', {
				seed: () => {
					return Promise.resolve ();
				}
			});

			mockery.registerMock ('git-config', function (cb) {
				cb (false, {
					user: {
						name: 'user_name',
						email: 'user_email'
					}
				});
			});
		});

		after (() => {
			mockery.deregisterAll ();
			mockery.disable ();
		});

		describe ('standard', () => {
			before ((done) => {
				helpers.run (path.join (__dirname, '../../../app')).withArguments ([ '--skip-install' ]).withPrompts (prompts).on ('end', done);
			});

			describe ('root', () => {
				it ('should generate config files', () => {
					var files = [
						'.gitignore', 'bower.json', '.bowerrc', '.travis.yml', '.jshintc', '.editorconfig',
						'LICENSE.MIT', 'README.mc', 'gulpfile.js', 'karma.conf.js', 'package.json'
					];

					files.forEach (function (i) {
						expect (i).to.exist ();
					});
				});
			});

			describe ('config', () => {
				it ('should generate config', () => {
					expect ('config/default.js').to.exist ();
					expect ('config/production.js').to.exist ();
				});
			});

			describe ('src', () => {
				it ('should generate server.js', () => {
					var files = [ 
						'.jshintrc',
						'index.js', 'jwt.js',
						'routes/authenticate.js', 'routes/web.js'
					];

					expect ('server.js').to.exist ();
					files.forEach ((item) => {
						expect ('src/server/' + item).to.exist ();
					});
				});

				it ('should generate web app', () => {
					var files = [ 
						'.jshintrc',
						'index.html',
						'app/app.module.js',
						'app/shared/auth/auth.factory.js', 'app/shared/auth/auth.directive.js',
						'app/components/topnav/topnavView.html', 'app/components/topnav/topnavController.js',
						'app/components/home/homeView.html', 'app/components/home/homeController.js',
						'app/components/apidoc/apidocView.html', 'app/components/apidoc/apidocController.js',
						'app/components/login/loginView.html', 'app/components/login/loginController.js',
						'assets/less/app.less'
					];

					files.forEach ((item) => {
						expect ('src/web/' + item).to.exist ();
					});
				});
			});

			describe ('locale', () => {
				it ('should generate locale files', () => {
					expect ('src/web/locale/locale-en.json').to.exist ();
				});
			});

			describe ('unit test', () => {
				it ('should generate server tests', () => {
					var files = [ 
						'.jshintrc',
						'index.js', 'jwt.js',
						'routes/authenticate.js', 'routes/web.js'
					];

					files.forEach ((item) => {
						expect ('test/unit/server/' + item).to.exist ();
					});
				});

				it ('should generate web tests', () => {
					var files = [ 
						'app.module.js',
						'components/topnav/topnavController.js',
						'components/home/homeController.js',
						'components/login/loginController.js',
						'components/apidoc/apidocController.js',
					];

					files.forEach ((item) => {
						expect ('test/unit/web/app/' + item).to.exist ();
					});
				});
			});
		});

		describe ('github repo', () => {
			describe ('package.json', () => {
				before ((done) => {
					helpers.run (path.join (__dirname, '../../../app')).withArguments ([ '--skip-install' ]).withPrompts ({
						cfgName: name,
						cfgDescription: 'my-description',
						cfgBugs: 'my-issues',
						cfgLicense: 'MIT',
						cfgContribName: 'my-name',
						cfgContribEmail: 'my-email',
						cfgContribUrl: 'my-url',
						cfgRepository: 'git@github.com:fluky/generator-oldschool.git',
						cfgFramework: 'AngularJS',
						cfgSocial: [ 'github' ]
					}).on ('end', () => {
						done ();
					});
				});

				it ('should parse github repo', () => {
					expect ('package.json').to.have.content ('https://github.com/fluky/generator-oldschool');
				});
			});
		});

		describe ('Apache License', () => {
			describe ('LICENSE', () => {
				before ((done) => {
					helpers.run (path.join (__dirname, '../../../app')).withArguments ([ '--skip-install' ]).withPrompts ({
						cfgName: name,
						cfgDescription: 'my-description',
						cfgHomepage: 'my-homepage',
						cfgBugs: 'my-issues',
						cfgLicense: 'Apache-2.0',
						cfgContribName: 'my-name',
						cfgContribEmail: 'my-email',
						cfgContribUrl: 'my-url',
						cfgRepository: 'my-repository',
						cfgFramework: 'AngularJS',
						cfgSocial: []
					}).on ('end', () => {
						done ();
					});
				});

				it ('should parse github repo', () => {
					expect ('LICENSE.Apache-2.0').to.exist ();
				});
			});
		});

		it ('should eat seed failure', (done) => {
			mockery.deregisterMock ('./db');
			mockery.registerMock ('./db', {
				seed: () => {
					return Promise.reject ();
				}
			});
			helpers.run (path.join (__dirname, '../../../app')).withPrompts (prompts).on ('end', done);
		});
	});
} ());
