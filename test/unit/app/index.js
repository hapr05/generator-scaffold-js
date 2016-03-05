(function () {
	'use strict';

	const assert = require ('yeoman-assert'),
		chai = require ('chai'),
		dirtyChai = require ('dirty-chai'),
		expect = chai.expect,
		helpers = require ('yeoman-test'),
		sinon = require ('sinon'),
		mockery = require ('mockery'),
		path = require ('path'),
		spawn = require ('child_process').spawn,
		name = 'name-x',
		prompts = {
			cfgName: name,
			cfgDescription: 'my-description',
			cfgHomepage: 'my-homepage',
			cfgBugs: 'my-issues',
			cfgLicense: 'MIT',
			cfgContribName: 'my-name',
			cfgContribEmail: 'my-email',
			cfgContribUrl: 'my-url',
			cfgRepository: 'my-repository',
			cfgFramework: 'AngularJS'
		};

	chai.use (dirtyChai);
	chai.use (function (_chai, utils) {
		_chai.Assertion.addMethod ('exist', function () {
			var obj = utils.flag (this, 'object');
			assert.file (obj);
		});

		_chai.Assertion.addMethod ('content', function (str) {
			var obj = utils.flag (this, 'object');
			assert.fileContent (obj, str);
		});
	});

	describe ('oldschool:app', () => {
		describe ('stanard', () => {
			before ((done) => {
				helpers.run (path.join ( __dirname, '../../../app')).withArguments ([ '--skip-install' ]).withPrompts (prompts).on ('end', done);
			});

			describe ('root', () => {
				var gitConfigStub;

				it ('should generate package.jason', () => {
					mockery.enable ({
						warnOnReplace: false,
						warnOnUnregistered: false,
						useCleanCache: true
					});

					gitConfigStub = sinon.stub ().callsArgWith (0, false, { user: {} });

					mockery.registerMock ('git-config', gitConfigStub);

					expect ('package.json').to.exist ();
				});

				it ('should generate config files', () => {
					var files = [
						'.gitignore', 'bower.json', '.bowerrc', '.travis.yml', '.jshintc', '.editorconfig',
						'LICENSE.MIT', 'README.mc', 'gulpfile.js', 'karma.conf.js'
					];

					files.forEach (function (i) {
						expect (i).to.exist ();
					});
				});
			});

			describe ('config', () => {
				it ('should generate default.json', () => {
					expect ('config/default.json').to.exist ();
					expect ('config/production.json').to.exist ();
				});
			});

			describe ('src', () => {
				it ('should generate server.js', () => {
					var files = [ 
						'.jshintrc',
						'index.js',
						'routes/api.js', 'routes/web.js'
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
						'app/components/topnav/topnavView.html', 'app/components/topnav/topnavController.js',
						'app/components/home/homeView.html', 'app/components/home/homeController.js',
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
						'index.js', 'routes/api.js', 'routes/web.js'
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
					helpers.run (path.join ( __dirname, '../../../app')).withArguments ([ '--skip-install' ]).withPrompts ({
						cfgName: name,
						cfgDescription: 'my-description',
						cfgBugs: 'my-issues',
						cfgLicense: 'MIT',
						cfgContribName: 'my-name',
						cfgContribEmail: 'my-email',
						cfgContribUrl: 'my-url',
						cfgRepository: 'git@github.com:fluky/generator-oldschool.git',
						cfgFramework: 'AngularJS'
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
					helpers.run (path.join ( __dirname, '../../../app')).withArguments ([ '--skip-install' ]).withPrompts ({
						cfgName: name,
						cfgDescription: 'my-description',
						cfgHomepage: 'my-homepage',
						cfgBugs: 'my-issues',
						cfgLicense: 'Apache-2.0',
						cfgContribName: 'my-name',
						cfgContribEmail: 'my-email',
						cfgContribUrl: 'my-url',
						cfgRepository: 'my-repository',
						cfgFramework: 'AngularJS'
					}).on ('end', () => {
						done ();
					});
				});

				it ('should parse github repo', () => {
					expect ('LICENSE.Apache-2.0').to.exist ();
				});
			});
		});

		/* it won't run npm install when unit testing */
		xdescribe ('npm install', () => {
			before ((done) => {
				helpers.run (path.join ( __dirname, '../../../app')).withPrompts (prompts).on ('end', done);
			});

			it ('should install node_modules', () => {
				assert.noFile ('node_modules');
			});
		});

		/* Too slow for Unit Testing */
		xdescribe ('generated app', () => {
			before ((done) => {
				helpers.run (path.join ( __dirname, '../../../app')).withPrompts (prompts).on ('end', done);
			});

			it ('should build clean', (done) => {
				spawn ('npm', [ 'install' ]).on ('close', (code) => {
					assert.strictEqual (code, 0);
					spawn ('gulp').on ('close', (code) => {
						assert.strictEqual (code, 0);
						done ();
					});
				});
			});
		});
	});
} ());
