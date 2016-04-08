'use strict';

const mongo = require ('mongodb').MongoClient,
	crypto = require ('crypto'),
	pkg = require ('../package');

class Db {
	constructor () { }

// versions = [ '0.0.1' ],
	_indexV1 () {
		this.userCollections.createIndex ({ username: 1 });
		this.userCollections.createIndex ({ username: 1, active: 1 });
		this.userCollections.createIndex ({ username: 1, password: 1 });
		this.userCollections.createIndex ({ username: 1, password: 1, active: 1 });
		this.userCollections.createIndex ({ username: 1, provider: 1 }, { unique: true });
		this.userCollections.createIndex ({ username: 1, provider: 1, active: 1 });
		this.userCollections.createIndex ({ email: 1 }, { unique: true });
		this.userCollections.createIndex ({ email: 1, active: 1 });
	}

	_seedV1 () {
		return new Promise ((resolve, reject) => this.db.dropDatabase ().then (() => {
			this.db.close ();

			return mongo.connect (this.config.cfgDbUrl).then (db => {
				this.db = db;
				this.seedCollection = db.collection ('seed');
				this.userCollections = db.collection ('users');

				this._indexV1 ();

				this.db.createCollection ('log', {
					capped: true,
					size: 1024 * 1024 * 1024
				});

				this.db.createCollection ('audit', {
					capped: true,
					size: 1024 * 1024 * 1024
				});

				return this.userCollections.insertMany ([{
					username: 'admin', password: crypto.createHash ('sha256').update ('admin').digest ('hex'),
					fullName: 'Administrator', nickname: 'Admin', email: 'admin@localhost',
					provider: 'internal', active: true, created: new Date (), scope: [ 'ROLE_ADMIN', 'ROLE_USER' ]
				}, {
					username: 'user', password: crypto.createHash ('sha256').update ('user').digest ('hex'),
					fullName: 'User', nickname: 'User', email: 'user@localhost',
					provider: 'internal', active: true, created: new Date (), scope: [ 'ROLE_USER' ]
				}]).then (() => this.seedCollection.updateOne ({ _id: 1 }, {
					_id: 1,
					version: this.version,
					name: this.config.cfgName,
					description: this.config.cfgDescription,
					contributors: [{ name: this.config.cfgContribName, email: this.config.cfgContribEmail, url: this.config.cfgContribUrl }],
					repository: this.config.cfgRepository,
					homepage: this.config.cfgHomepage,
					license: this.config.cfgLicense,
					issues: this.config.cfgBugs,
					framework: this.config.cfgFramework
				}, { upsert: true }).then (() => {
					resolve ();
				}));
			});
		}).catch (() => {
			reject ();
		}));
	}

	_seedDatabase () {
		this.version = pkg.version.split ('-') [ 0 ];

		return this._seedV1 ();
	}

	seed (config) {
		return new Promise ((resolve, reject) => {
			const fail = () => {
				this.db.close ();
				reject ();
			},
			succeed = () => {
				this.db.close ();
				resolve ();
			};

			this.config = config;

			mongo.connect (this.config.cfgDbUrl).then (db => {
				this.db = db;
				this.seedCollection = this.db.collection ('seed');

				this.seedCollection.findOne ({ _id: 1 }).then (dbconfig => {
					this.dbconfig = dbconfig;
					this._seedDatabase ().then (succeed).catch (fail);
				}).catch (() => {
					this._seedDatabase ().then (succeed).catch (fail);
				});
			}).catch (err => {
				reject (`Failed to seed database: ${ err }.`);
			});
		});
	}
}

module.exports = new Db ();
