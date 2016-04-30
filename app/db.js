'use strict';

const mongo = require ('mongodb').MongoClient,
	crypto = require ('crypto'),
	pkg = require ('../package');

/**
 * Database setup and seed class
 * @class Db
 * @memberOf app
 */
class Db {
// versions = [ '0.0.1' ],
	/**
	 * Creates indexes on collections for initial database
	 * @function app.Db~_indexV1
	 * @private
	 */
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

	/**
	 * Writes initial seed data
	 * @function app.Db~_seedV1
	 * @private
	 * @returns {Promise} promise
	 */
	_seedV1 () {
		return new Promise ((resolve, reject) => this.db.dropDatabase ().then (() => {
			this.db.close ();

			return mongo.connect (this.config.cfgDbUrl).then (db => {
				var d = new Date ();

				/**
				 * MongoDB database instance
				 * @member {MongoDb.Db} app.Db~db
				 * @private
				 */
				this.db = db;
				/**
				 * Seed collection (stores current database seed version)
				 * @member {MongoDb.Collection} app.Db~seedCollection
				 * @private
				 */
				this.seedCollection = db.collection ('seed');
				/**
				 * User collection
				 * @member {MongoDb.Collection} app.Db~seedCollection
				 * @private
				 */
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
					provider: 'internal', active: true, validated: true, created: d, modified: d, scope: [ 'ROLE_ADMIN', 'ROLE_USER' ]
				}, {
					username: 'user', password: crypto.createHash ('sha256').update ('user').digest ('hex'),
					fullName: 'User', nickname: 'User', email: 'user@localhost',
					provider: 'internal', active: true, validated: true, created: d, modified: d, scope: [ 'ROLE_USER' ]
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

	/**
	 * Brings the database from the current seed level to the latest
	 * @function app.Db~_seedDatabase
	 * @private
	 * @returns {Promise} promise
	 */
	_seedDatabase () {
		/**
		 * Curent database version
		 * @member {String} app.Db~version
		 * @private
		 */
		this.version = pkg.version.split ('-') [0];

		return this._seedV1 ();
	}

	/**
	 * Connects to the database and brings from the current seed level to the latest
	 * @function app.Db~seed
	 * @public
	 * @param {Object} config - generator configuration (must have cfgDbUrl)
	 * @returns {Promise} promise
	 */
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

			/**
			 * AppGenerator configuration
			 * @member {Object} app.Db~config
			 * @private
			 */
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
