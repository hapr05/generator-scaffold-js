(function () {
	'use strict';

	const assert = require ('yeoman-assert'),
		helpers = require ('yeoman-test'),
		sinon = require ('sinon'),
		mockery = require ('mockery'),
		path = require ('path'),
		name = 'name-x';

	before ((done) => {
		helpers.run (path.join ( __dirname, '../../app')).withArguments ([ name ]).withPrompts ({
			name: name,
			description: 'my-description',
			homepage: 'my-homepage',
			bugs: 'my-issues',
			license: 'MIT',
			cName: 'my-name',
			cEmail: 'my-email',
			cUrl: 'my-url',
			repository: 'my-repository'
		}).on ('end', done);
	});

	describe ('oldschool:app', () => {
		describe ('.gitignore', () => {
			it ('should generate .gitignore', () => {
				assert.file ('.gitignore');
			});

			it ('should contain node_modules', () => {
				assert.fileContent ('.gitignore', 'node_modules');
			});

			it ('should contain coverage', () => {
				assert.fileContent ('.gitignore', 'coverage');
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

			it ('should parse github repo', (done) => {
				helpers.run (path.join ( __dirname, '../../app')).withArguments ([ name ]).withPrompts ({
					name: name,
					description: 'my-description',
					bugs: 'my-issues',
					license: 'MIT',
					cName: 'my-name',
					cEmail: 'my-email',
					cUrl: 'my-url',
					repository: 'git@github.com:fluky/generator-oldschool.git'
				}).on ('end', () => {
					assert.fileContent ('package.json', 'https://github.com/fluky/generator-oldschool');
					done ();
				});
			});
		});

		describe ('.travis.yml', () => {
			it ('should generate .travis.yml', () => {
				assert.file ('.travis.yml');
			});
		});
	});
} ());


