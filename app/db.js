(function () {
	'use strict';

	const mongo = require ('mongodb').MongoClient,
		crypto = require ('crypto'),
		pkg = require ('../package');
		//versions = [ '0.0.1' ];

	function seedV1 (db, seed, config, version) {
		const users = db.collection ('users');

		seed.drop ();
		users.drop ();

		users.createIndex ({ username: 1, active: 1 });
		users.createIndex ({ username: 1 }, { unique: true });

		return users.insertMany ([{
			username: 'admin', password: crypto.createHash ('sha256').update ('admin').digest ('hex'),
			fullName: 'Administrator', nickName: 'Admin', email: 'admin@localhost', lang: 'en', 
			active: true, created: new Date (), scopes: [ 'ROLE_ADMIN', 'ROLE_USER' ]
		}, {
			username: 'user', password: crypto.createHash ('sha256').update ('user').digest ('hex'),
			fullName: 'User', nickName: 'User', email: 'user@localhost', lang: 'en', 
			active: true, created: new Date (), scopes: [ 'ROLE_USER' ]
		}]).then (() => {
			return seed.updateOne ({ _id: 1 }, {
				_id: 1,
				version: version,
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
			}, { upsert: true });
		});
	}

	function seedDatabase (db, seed, config) {
		const version = pkg.version.split ('-') [0];

		return seedV1 (db, seed, config, version);
	}

	module.exports = {
		seed: (config) => {
			return new Promise ((resolve, reject) => {
				mongo.connect (config.cfgDbUrl).then ((db) => {
					const seed = db.collection ('seed');

					seed.findOne ({ _id: 1 }).then ((dbconfig) => {
						seedDatabase (db, seed, config, dbconfig).then (() => {
							db.close ();
							resolve ();
						}).catch ((err) => {
							db.close ();
							reject (err);
						});
					}).catch (() => {
						seedDatabase (db, seed, config).then (() => {
							db.close ();
							resolve ();
						}).catch ((err) => {
							db.close ();
							reject (err);
						});
					});
				}).catch ((err) => {
					reject (`Failed to seed database: ${ err }.`);
				});
			});
		}
	};
} ());
