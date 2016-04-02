(function () {
	'use strict';

	const mongo = require ('mongodb').MongoClient,
		crypto = require ('crypto'),
		pkg = require ('../package');
		//versions = [ '0.0.1' ];

	function indexV1 (users) {
		users.createIndex ({ username: 1 });
		users.createIndex ({ username: 1, active: 1 });
		users.createIndex ({ username: 1, password: 1 });
		users.createIndex ({ username: 1, password: 1, active: 1 });
		users.createIndex ({ username: 1, provider: 1 }, { unique: true });
		users.createIndex ({ username: 1, provider: 1, active: 1 });
		users.createIndex ({ email: 1 }, { unique: true });
		users.createIndex ({ email: 1, active: 1 });
	}

	function seedV1 (odb, config, version) {
		return new Promise ((resolve, reject) => {
			return odb.dropDatabase ().then (() => {
				odb.close ();
				return mongo.connect (config.cfgDbUrl).then ((db) => {
					const	seed = db.collection ('seed'),
						users = db.collection ('users');

					indexV1 (users);

					db.createCollection ('log', {
						capped: true,
						size: 1024 * 1024 * 1024
					});

					db.createCollection ('audit', {
						capped: true,
						size: 1024 * 1024 * 1024
					});

					return users.insertMany ([{
						username: 'admin', password: crypto.createHash ('sha256').update ('admin').digest ('hex'),
						fullName: 'Administrator', nickname: 'Admin', email: 'admin@localhost', lang: 'en', 
						provider: 'internal', active: true, created: new Date (), scope: [ 'ROLE_ADMIN', 'ROLE_USER' ]
					}, {
						username: 'user', password: crypto.createHash ('sha256').update ('user').digest ('hex'),
						fullName: 'User', nickname: 'User', email: 'user@localhost', lang: 'en',
						provider: 'internal', active: true, created: new Date (), scope: [ 'ROLE_USER' ]
					}]).then (() => {
						return seed.updateOne ({ _id: 1 }, {
							_id: 1,
							version,
							name: config.cfgName,
							description: config.cfgDescription,
							contributors: [
								{ name: config.cfgContribName, email: config.cfgContribEmail, url: config.cfgContribUrl }
							],
							repository: config.cfgRepository,
							homepage: config.cfgHomepage,
							license: config.cfgLicense,
							issues: config.cfgBugs,
							framework: config.cfgFramework
						}, { upsert: true }).then (() => {
							resolve (db);
						}).catch (() => {
							reject (db);
						});
					});
				});
			}).catch (() => {
				reject (odb);
			});
		});
	}

	function seedDatabase (db, seed, config) {
		const version = pkg.version.split ('-') [0];

		return seedV1 (db, config, version);
		/* since v1 drops will need to reload seed for futuer versions */
	}

	module.exports = {
		seed: (config) => {
			return new Promise ((resolve, reject) => {
				mongo.connect (config.cfgDbUrl).then ((db) => {
					const seed = db.collection ('seed');

					seed.findOne ({ _id: 1 }).then ((dbconfig) => {
						seedDatabase (db, seed, config, dbconfig).then ((fdb) => {
							fdb.close ();
							resolve ();
						}).catch ((fdb) => {
							fdb.close ();
							reject ();
						});
					}).catch (() => {
						seedDatabase (db, seed, config).then ((fdb) => {
							fdb.close ();
							resolve ();
						}).catch ((fdb) => {
							fdb.close ();
							reject ();
						});
					});
				}).catch ((err) => {
					reject (`Failed to seed database: ${ err }.`);
				});
			});
		}
	};
} ());
