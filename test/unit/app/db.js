'use strict';

const chai = require ('chai'),
	dirtyChai = require ('dirty-chai'),
	chaiAsPromised = require ('chai-as-promised'),
	expect = chai.expect,
	sinon = require ('sinon'),
	mockery = require ('mockery');

var database;

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
		database = require ('../../../app/db');
	});

	afterEach (() => {
		sandbox.restore ();
	});

	after (() => {
		mockery.deregisterAll ();
		mockery.disable ();
	});

	it ('should seed database', () => {
		sandbox.stub (collection, 'findOne', () => Promise.reject ('err'));
		return expect (database.seed ({})).to.be.fulfilled ();
	});

	it ('should reseed database', () => expect (database.seed ({})).to.be.fulfilled ());

	it ('should handle update failure on seed', () => {
		sandbox.stub (collection, 'updateOne', () => Promise.reject ('err'));
		return expect (database.seed ({})).to.be.rejected ();
	});

	it ('should handle update failure on reseed', () => {
		sandbox.stub (collection, 'findOne', () => Promise.reject ('err'));
		sandbox.stub (collection, 'updateOne', () => Promise.reject ('err'));
		return expect (database.seed ({})).to.be.rejected ();
	});

	it ('should handle connect failure', () => {
		sandbox.stub (mongo.MongoClient, 'connect', () => Promise.reject ('err'));
		return expect (database.seed ({})).to.be.rejected ();
	});

	it ('should handle drop failure', () => {
		sandbox.stub (db, 'dropDatabase', () => Promise.reject ('err'));
		return expect (database.seed ({})).to.be.rejected ();
	});
});
