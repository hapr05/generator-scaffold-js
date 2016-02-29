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
			repository: 'my-repository'
		};

	describe ('oldschool:app', () => {
		describe ('stanard', () => {
			before ((done) => {
				helpers.run (path.join ( __dirname, '../../../app')).withArguments ([ '--skip-install' ]).withPrompts (prompts).on ('end', done);
			});

			describe ('.gitignore', () => {
				it ('should generate .gitignore', () => {
					assert.file ('.gitignore');
				});
			});

			describe ('package.json', () => {
				var gitConfigStub;

				before (() => {
					mockery.enable ({
						warnOnReplace: false,
						warnOnUnregistered: false,
						useCleanCache: true
					});

					gitConfigStub = sinon.stub ().callsArgWith (0, false, { user: {} });

					mockery.registerMock ('git-config', gitConfigStub);
				});

				it ('should generate package.jason', () => {
					assert.file ('package.json');
				});

				it ('should contain correct content', () => {
					assert.jsonFileContent ('package.json', {
						name: name,
						version: '1.0.0-alpha.1',
						description: 'my-description',
						keywords: [
							'NodeJS',
							'hapi',
							'Bootstrap',
							'AngularJS',
							'MongoDB'
						],
						homepage: 'my-homepage',
						bugs: 'my-issues',
						license: 'MIT',
						contributors: {
							name: 'my-name',
							email: 'my-email',
							url: 'my-url'
						},
						files: [
						],
						main: 'index.js',
						bin: {},
						man: [],
						repository: 'my-repository',
						scripts: {
							test: 'gulp test'
						},
						dependencies: {
							config: 'latest',
							glue: 'latest',
							inert: 'latest'
						},
						devDependencies: {
							gulp: 'latest',
							'gulp-jshint': 'latest',
							'gulp-json-lint': 'latest',
							'gulp-nodemon': 'latest',
							'browser-sync': 'latest',
							'jshint': 'latest',
							'jshint-stylish': 'latest'
						},
						peerDependencies: {
						},
						bundledDependencies: {
						},
						optionalDependencies: {
						},
						engines: {
							node: '>= 5.7.0',
							npm: '>= 3.6.0'
						}
					});
				});
			});

			describe ('.travis.yml', () => {
				it ('should generate .travis.yml', () => {
					assert.file ('.travis.yml');
				});
			});

			describe ('.jshintrc', () => {
				it ('should generate .jshintrc', () => {
					assert.file ('.jshintrc');
				});
			});

			describe ('LICENSE', () => {
				it ('should generate LICENSE.MIT', () => {
					assert.file ('LICENSE.MIT');
				});
			});

			describe ('README.md', () => {
				it ('should generate README.md', () => {
					assert.file ('README.md');
				});
			});

			describe ('gulpfile.js', () => {
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
						repository: 'git@github.com:fluky/generator-oldschool.git'
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
						repository: 'my-repository'
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
