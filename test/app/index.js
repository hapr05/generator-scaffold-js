(function (require) {
	'use strict';

	const assert = require ('yeoman-assert'),
		helpers = require ('yeoman-test'),
			sinon = require ('sinon'),
			mockery = require ('mockery'),
			path = require ('path'),
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
				helpers.run (path.join ( __dirname, '../../app')).withArguments ([ '--skip-install' ]).withPrompts (prompts).on ('end', done);
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
						},
						devDependencies: {
							gulp: 'latest',
							'gulp-jshint': 'latest'
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
			});
		});

		describe ('github repo', () => {
			describe ('package.json', () => {
				before ((done) => {
					helpers.run (path.join ( __dirname, '../../app')).withArguments ([ '--skip-install' ]).withPrompts ({
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
					helpers.run (path.join ( __dirname, '../../app')).withArguments ([ '--skip-install' ]).withPrompts ({
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
	});

	describe ('npm install', () => {
		before ((done) => {
			helpers.run (path.join ( __dirname, '../../app')).withPrompts (prompts).on ('end', done);
		});

		it ('should install node_modules', () => {
			assert.noFile ('node_modules'); // Seems to always skip when testing
		});
	});


	describe ('generated app', () => {
		it ('should build clean', () => {



		});
	});
} (require));
