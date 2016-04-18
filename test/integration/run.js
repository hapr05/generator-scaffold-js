'use strict';

const spawn = require ('child_process').spawn,
	path = require ('path'),
	helpers = require ('yeoman-test'),
	temp = require ('temp'),
	mongo = require ('mongodb'),
	Db = mongo.Db,
	Server = mongo.Server,
	SUCCESS = 0,
	FAILURE = 1;

class Run {

	constructor () {
		Object.assign (this, {
			testDir: 'scaffold_js_test',
			prompts: {
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
				cfgFramework: 'AngularJS',
				cfgSocial: [ 'github' ]
			}
		});

		process.env.JWT_KEY = 'test';
		temp.track ();

		this.create ().then (dbname => {
			this.dropDb (dbname).then (() => {
				console.info ('Temporary DB Dropped');
				process.exit (SUCCESS);
			}).catch (err => {
				console.info ('Temporary DB Drop Failed');
				console.error (err);
				process.exit (FAILURE);
			});
		}).catch ((err, dbname) => {
			console.error (err);
			this.dropDb (dbname).then (() => {
				process.exit (FAILURE);
			}).catch (error => {
				console.error (error);
				process.exit (FAILURE);
			});
		});
	}

	create () {
		return new Promise ((resolve, reject) => {
			console.info ('Creating test directory');
			temp.mkdir (this.testDir, (err, dir) => {
				if (err) {
					reject (err);
				} else {
					const dbname = path.basename (dir);

					console.info (`Test directory created: ${ dir }`);
					process.chdir (dir);

					console.info ('Generating app');
					helpers.run (path.join (__dirname, '../../app')).withPrompts (this.prompts).inDir (dir).on ('end', () => {
						var p;

						console.info ('Running npm install');
						p = spawn ('npm', [ 'install' ]).on ('close', errCode => {
							if (errCode) {
								reject (`failed to install npm modules: ${ errCode }`, dbname);
							} else {
								console.info ('Running bower install');
								p = spawn ('bower', [ 'install' ]).on ('close', error => {
									if (error) {
										reject (`failed to install bower modules: ${ error }`, dbname);
									} else {
										console.info ('Running gulp ci');
										p = spawn ('gulp', [ 'ci' ]).on ('close', code => {
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
					}).on ('error', error => reject (`failed to generate: ${ error }`, dbname));
				}
			});
		});
	}

	dropDb (name) {
		if (name) {
			return new Promise ((resolve, reject) => {
				new Db (name, new Server ('localhost', 27017)).open ().then (d => {
					d.dropDatabase ().then (() => {
						resolve ();
					}).catch (err => {
						reject (err);
					});
				}).catch (err => {
					reject (err);
				});
			});
		}

		return Promise.resolve ();
	}
}

new Run ();
