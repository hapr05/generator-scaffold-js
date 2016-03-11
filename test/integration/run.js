(function () {
	'use strict';

	const spawn = require ('child_process').spawn,
		path = require ('path'),
		helpers = require ('yeoman-test'),
		temp = require ('temp'),
		mongo = require ('mongodb'),
		db = mongo.Db,
		server = mongo.Server,
		testDir = 'oldschool_test',
		prompts = {
			cfgName: 'test-app',
			cfgDbUrl: 'mongodb://localhost:27017/test',
			cfgDescription: 'test-description',
			cfgHomepage: 'test-homepage',
			cfgBugs: 'test-issues',
			cfgLicense: 'MIT',
			cfgContribName: 'test-name',
			cfgContribEmail: 'test-email',
			cfgContribUrl: 'test-url',
			cfgRepository: 'test-repository',
			cfgFramework: 'AngularJS'
		};


	function create () {
		return new Promise ((resolve, reject) => {
			console.info ('Creating test directory');
			temp.mkdir (testDir, (e, dir) => {
				if (e) {
					reject (e);
				} else {
					var dbname = path.basename (dir);

					console.info (`Test directory created: ${ dir }`);
					process.chdir (dir);

					console.info ('Generating app');
					helpers.run (path.join ( __dirname, '../../app')).withPrompts (prompts).inDir (dir).on ('end', () => {
						var p;

						console.info ('Running npm install');
						p = spawn ('npm', [ 'install' ]).on ('close', (code) => {
							if (code) {
								reject (`failed to install npm modules: ${ code }`, dbname);
							} else {
								console.info ('Running bower install');
								p = spawn ('bower', [ 'install' ]).on ('close', (code) => {
									if (code) {
										reject (`failed to install bower modules: ${ code }`, dbname);
									} else {
										console.info ('Running gulp ci');
										p = spawn ('gulp', [ 'ci', 'build' ]).on ('close', (code) => {
											if (code) {
												reject (`gulp failed: ${ code }`, dbname);
											} else {
												console.info ('Build completed');
												resolve (dbname);
											}
										});
										p.stdout.pipe (process.stdout);
										p.stderr.pipe (process.stderr);
									}
								});
								p.stdout.pipe (process.stdout);
								p.stderr.pipe (process.stderr);
							}
						});
						p.stdout.pipe (process.stdout);
						p.stderr.pipe (process.stderr);
					}).on ('error', (e) => {
						reject ('failed to generate: ' + e, dbname);
					});
				}
			});
		});
	}

	function dropDb (name) {
		if (name) {
			return new Promise ((resolve, reject)  => {
				new db (name, new server ('localhost', 27017)).open ().then ((d) => {
					d.dropDatabase ().then (() => {
						resolve ();
					}).catch ((err) => {
						reject (err);
					});
				}).catch ((err) => {
					reject (err);
				});
			});
		} else {
			return Promise.resolve ();
		}
	}

	//temp.track ();

	create ().then ((dbname) => {
		dropDb (dbname).then (() => {
			console.info ('Temporary DB Dropped');
			process.exit (0);
		}).catch ((err) => {
			console.info ('Temporary DB Drop Failed');
			console.error (err);
			process.exit (1);
		});
	}).catch ((err, dbname) => {
		console.error (err);
		dropDb (dbname).then (() => {
			process.exit (1);
		}).catch ((err) => {
			console.error (err);
			process.exit (1);
		});
	});
} ());
