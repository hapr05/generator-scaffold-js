(function () {
	'use strict';

	const mongo = require ('mongodb').MongoClient,
		pkg = require ('../package');
		//versions = [ '0.0.1' ];

	function seedDatabase (db, seed, config) {
		const version = pkg.version.split ('-') [0];

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
