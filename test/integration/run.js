(function (require, process) {
	'use strict';

	const spawn = require ('child_process').spawn,
		path = require ('path'),
		helpers = require ('yeoman-test'),
		temp = require ('temp'),
		testDir = 'oldschool_test',
		prompts = {
			name: 'test-app',
			description: 'test-description',
			homepage: 'test-homepage',
			bugs: 'test-issues',
			license: 'MIT',
			cName: 'test-name',
			cEmail: 'test-email',
			cUrl: 'test-url',
			repository: 'test-repository'
		};


	function create () {
		return new Promise ((resolve, reject) => {
			console.info ('Creating test directory');
			temp.mkdir (testDir, (e, dir) => {
				if (e) {
					reject (e);
				} else {
					console.info (`Test directory created: ${ dir }`);
					process.chdir (dir);

					console.info ('Generating app');
					helpers.run (path.join ( __dirname, '../../app')).withPrompts (prompts).inDir (dir).on ('end', () => {
						var p;

						console.info ('Running npm install');
						p = spawn ('npm', [ 'install' ]).on ('close', (code) => {
							if (code) {
								reject (`failed to install npm modules: ${ code }`);
							} else {
								console.info ('Running gulp ci');
								spawn ('gulp', [ 'ci' ]).on ('close', (code) => {
									if (code) {
										reject (`gulp failed: ${ code }`);
									} else {
										resolve ();
									}
								});
								p.stdout.pipe (process.stdout);
								p.stderr.pipe (process.stderr);
							}
						});
						p.stdout.pipe (process.stdout);
						p.stderr.pipe (process.stderr);
					}).on ('error', (e) => {
						reject ('failed to generate: ' + e);
					});
				}
			});
		});
	}

	temp.track ();
	create ().then (() => {
		process.exit (0);
	}, (e) => {
		console.error (e);
		process.exit (1);
	});
} (require, process));
