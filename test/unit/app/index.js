(function (require) {
	'use strict';

	const assert = require ('yeoman-assert'),
		helpers = require ('yeoman-test'),
		sinon = require ('sinon'),
		mockery = require ('mockery'),
		path = require ('path'),
		spawn = require ('child_process').spawn,
		name = 'name-x',
		prompts = {
			name: name,
			description: 'my-description',
			homepage: 'my-homepage',
			bugs: 'my-issues',
			license: 'MIT',
			cName: 'my-name',
			cEmail: 'my-email',
			cUrl: 'my-url',
			repository: 'my-repository',
			framework: 'AngularJS'
		};

	describe ('oldschool:app', () => {
		describe ('stanard', () => {
			before ((done) => {
				helpers.run (path.join ( __dirname, '../../../app')).withArguments ([ '--skip-install' ]).withPrompts (prompts).on ('end', done);
			});

			describe ('root', () => {
				var gitConfigStub;

				it ('should generate .gitignore', () => {
					assert.file ('.gitignore');
				});

				it ('should generate package.jason', () => {
					mockery.enable ({
						warnOnReplace: false,
						warnOnUnregistered: false,
						useCleanCache: true
					});

					gitConfigStub = sinon.stub ().callsArgWith (0, false, { user: {} });

					mockery.registerMock ('git-config', gitConfigStub);

					assert.file ('package.json');
				});

				it ('should generate bower.json', () => {
					assert.file ('bower.json');
				});

				it ('should generate .bowerrc', () => {
					assert.file ('.bowerrc');
				});

				it ('should generate .travis.yml', () => {
					assert.file ('.travis.yml');
				});

				it ('should generate .jshintrc', () => {
					assert.file ('.jshintrc');
				});

				it ('should generate LICENSE.MIT', () => {
					assert.file ('LICENSE.MIT');
				});

				it ('should generate README.md', () => {
					assert.file ('README.md');
				});

				it ('should generate gulpfile.js', () => {
					assert.file ('gulpfile.js');
				});
			});

			describe ('config', () => {
				it ('should generate default.json', () => {
					assert.file ('config/default.json');
				});
			});

			describe ('src', () => {
				it ('should generate server.js', () => {
					var files = [ 'server/index.js', 'server/routes/api.js', 'server/routes/web.js', 'web/index.html' ];

					files.forEach ((item) => {
						assert.file ('src/' + item);
					});
				});
			});
		});

		describe ('github repo', () => {
			describe ('package.json', () => {
				before ((done) => {
					helpers.run (path.join ( __dirname, '../../../app')).withArguments ([ '--skip-install' ]).withPrompts ({
						name: name,
						description: 'my-description',
						bugs: 'my-issues',
						license: 'MIT',
						cName: 'my-name',
						cEmail: 'my-email',
						cUrl: 'my-url',
						repository: 'git@github.com:fluky/generator-oldschool.git',
						framework: 'AngularJS'
					}).on ('end', () => {
						done ();
					});
				});

				it ('should parse github repo', () => {
					assert.fileContent ('package.json', 'https://github.com/fluky/generator-oldschool');
				});
			});
		});

		describe ('Apache License', () => {
			describe ('LICENSE', () => {
				before ((done) => {
					helpers.run (path.join ( __dirname, '../../../app')).withArguments ([ '--skip-install' ]).withPrompts ({
						name: name,
						description: 'my-description',
						homepage: 'my-homepage',
						bugs: 'my-issues',
						license: 'Apache-2.0',
						cName: 'my-name',
						cEmail: 'my-email',
						cUrl: 'my-url',
						repository: 'my-repository',
						framework: 'AngularJS'
					}).on ('end', () => {
						done ();
					});
				});

				it ('should parse github repo', () => {
					assert.file ('LICENSE.Apache-2.0');
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
} (require));
