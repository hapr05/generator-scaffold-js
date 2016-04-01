(function () {
	'use strict';

	const chai = require ('chai'),
		dirtyChai = require ('dirty-chai'),
		chaiAsPromised = require ('chai-as-promised'),
		expect = chai.expect,
		sinon = require ('sinon'),
		mockery = require ('mockery');

	chai.use (chaiAsPromised);
	chai.use (dirtyChai);

	describe ('oldschool:app db', () => {
		var collection = {
			findOne () {
				return Promise.resolve ({});
			},
			updateOne () {
				return Promise.resolve ();
			},
			insertMany () {
				return Promise.resolve ();
			},
			createIndex () {}
		},
		db = {
			dropDatabase () {
				return Promise.resolve ();
			},
			createCollection () {
				return Promise.resolve ();
			},
			collection () {
				return collection;
			},
			close () {}
		},
		mongo = {
			MongoClient: {
				connect () {
					return Promise.resolve (db);
				}
			}
		},
		sandbox = sinon.sandbox.create ();

		before (() => {
			mockery.enable ({
				warnOnReplace: false,
				warnOnUnregistered: false,
				useCleanCache: true
			});

			mockery.registerMock ('mongodb', mongo);
		});

		afterEach (() => {
			sandbox.restore ();
		});

		after (() => {
			mockery.deregisterAll ();
			mockery.disable ();
		});

		it ('should seed database', () => {
			var db = require ('../../../app/db');

			sandbox.stub (collection, 'findOne', () => {
				return Promise.reject ('err');
			});
			return expect (db.seed ({})).to.be.fulfilled ();
		});

		it ('should reseed database', () => {
			var db = require ('../../../app/db');
			return expect (db.seed ({})).to.be.fulfilled ();
		});

		it ('should handle update failure on seed', () => {
			var db = require ('../../../app/db');

			sandbox.stub (collection, 'updateOne', () => {
				return Promise.reject ('err');
			});
			return expect (db.seed ({})).to.be.rejected ();
		});

		it ('should handle update failure on reseed', () => {
			var db = require ('../../../app/db');
			sandbox.stub (collection, 'findOne', () => {
				return Promise.reject ('err');
			});
			sandbox.stub (collection, 'updateOne', () => {
				return Promise.reject ('err');
			});
			return expect (db.seed ({})).to.be.rejected ();
		});

		it ('should handle connect failure', () => {
			var db = require ('../../../app/db');

			sandbox.stub (mongo.MongoClient, 'connect', () => {
				return Promise.reject ('err');
			});
			return expect (db.seed ({})).to.be.rejected ();
		});

		it ('should handle drop failure', () => {
			var db2 = require ('../../../app/db');

			sandbox.stub (db, 'dropDatabase', () => {
				return Promise.reject ('err');
			});
			return expect (db2.seed ({})).to.be.rejected ();
		});
	});
} ());
