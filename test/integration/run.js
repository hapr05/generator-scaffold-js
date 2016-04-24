'use strict';

const spawn = require ('child_process').spawn,
	path = require ('path'),
	temp = require ('temp'),
	mongo = require ('mongodb'),
	mkdirp = require ('mkdirp'),
	Db = mongo.Db,
	Server = mongo.Server,
	SUCCESS = 0,
	FAILURE = 1;

var helpers = require ('yeoman-test');

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
			},
			entityPrompts: {
				collectionName: 'test',
				name0: 'Boolean',
				type0: 'Boolean',
				name1: 'DateRanged',
				type1: 'Date',
				required1: true,
				min1: '01-01-2014',
				max1: '01-01-2015',
				name2: 'Date',
				type2: 'Date',
				required2: true,
				name3: 'NumberRanged',
				type3: 'Number',
				required3: true,
				integer3: false,
				min3: 1,
				max3: 5,
				name4: 'Number',
				type4: 'Number',
				required4: true,
				integer4: true,
				name5: 'StringRanged',
				type5: 'String',
				min5: 1,
				max5: 5,
				required5: true,
				name6: 'String',
				type6: 'String',
				required6: true
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

	install (dbname, resolve, reject) {
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
	}

	create () {
		return new Promise ((resolve, reject) => {
			console.info ('Creating test directory');
			temp.mkdir (this.testDir, (err, buildDir) => {
				if (err) {
					reject (err);
				} else {
					const dbname = path.basename (buildDir);

					console.info (`Test directory created: ${ buildDir }`);
					process.chdir (buildDir);

					console.info ('Generating app');
					helpers.run (path.join (__dirname, '../../app')).withPrompts (this.prompts).inDir (buildDir).on ('end', () => {
						helpers.testDirectory = function testDirectory (dir, cb) {
							var resolved;

							if (!dir) {
								throw new Error ('Missing directory');
							}

							resolved = path.resolve (dir);
							mkdirp.sync (resolved);
							process.chdir (resolved);
							cb ();
						};

						helpers.run (path.join (__dirname, '../../entity')).withOptions ({ force: true }).withPrompts (this.entityPrompts).inDir (buildDir).on ('end', () => {
							this.install (dbname, resolve, reject);
						}).on ('error', error => reject (`failed to generate entity: ${ error }`, dbname));
					}).on ('error', error => reject (`failed to generate app: ${ error }`, dbname));
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
