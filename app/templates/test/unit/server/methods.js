'use strict';

const chai = require ('chai'),
	expect = chai.expect,
	dirtyChai = require ('dirty-chai'),
	chaiAsPromised = require ('chai-as-promised'),
	sinon = require ('sinon'),
	hapi = require ('hapi'),
	mocks = require ('../helpers/mocks'),
	failed = require ('../helpers/authFailed'),
	methods = require ('../../../src/server/methods');

chai.use (chaiAsPromised);
chai.use (dirtyChai);

describe ('server methods', () => {
	var server,
		audit = {
			insertOne: sinon.stub ().returns (Promise.resolve ())
		},
		cursor = {
			count: () => Promise.resolve (),
			toArray: () => Promise.resolve (),
			sort: sinon.stub (),
			skip: sinon.stub (),
			limit: sinon.stub ()
		},
		collection = {
			find: () => cursor
		},
		sandbox = sinon.sandbox.create ();

	before (() => {
		mocks.mongo ({ audit });
	});

	beforeEach (() => {
		server = new hapi.Server ();
		server.connection ();
		return expect (server.register ([ require ('hapi-mongodb'), failed ]).then (() => {
			server.auth.strategy ('jwt', 'failed');
			methods (server);
		})).to.be.fulfilled ();
	});

	afterEach (() => {
		cursor.sort.reset ();
		cursor.skip.reset ();
		cursor.limit.reset ();
		sandbox.restore ();
	});

	after (() => {
		mocks.disable ();
	});

	describe ('misc', () => {
		it ('should audit', () => {
			server.methods.audit ('', {}, '', '', {});
			expect (audit.insertOne.called).to.be.true ();
		});

		it ('should copy filter values', () => {
			expect (server.methods.filter ({
				test: 1,
				other: 1
			}, [ 'test' ])).to.eql ({
				test: 1
			});
		});

		it ('should sort', () => {
			expect (server.methods.sort ({})).to.equal (false);
			expect (server.methods.sort ({
				sortBy: 'test',
				sortDir: 'asc'
			})).to.eql ({
				test: 1
			});
			expect (server.methods.sort ({
				sortBy: 'test',
				sortDir: 'desc'
			})).to.eql ({
				test: -1
			});
		});
	});

	describe ('check', () => {
		it ('should replace $ identifiers at BOL', () => {
			expect (server.methods.check ('$test')).to.equal ('test');
		});

		it ('should not replace $ identifiers other locations', () => {
			expect (server.methods.check ('t$est')).to.equal ('t$est');
		});
	});

	describe ('sanitize', () => {
		it ('should fail $ identifiers at BOL', () => {
			expect (server.methods.sanitize ({ test: '$test' }, [ 'test' ])).to.be.false ();
		});

		it ('should fail identifiers at BOL with no filters', () => {
			expect (server.methods.sanitize ({ start: '$test' })).to.be.false ();
		});

		it ('should not replace $ identifiers other locations', () => {
			expect (server.methods.sanitize ({ test: 't$est' }, [ 'test' ])).to.be.true ();
		});
	});

	describe ('search', () => {
		it ('should perform simple query', done => {
			server.methods.search (collection, { test: 1 }, [ 'test' ]).then (() => {
				try {
					expect (cursor.sort.called).to.be.false ();
					expect (cursor.skip.called).to.be.false ();
					expect (cursor.limit.called).to.be.false ();
					done ();
				} catch (e) {
					done (e);
				}
			});
		});

		it ('should perform sorted query', done => {
			cursor.sort.returns (cursor);
			server.methods.search (collection, { test: 1, sortBy: 'test', sortOrder: 'asc' }, [ 'test' ]).then (() => {
				try {
					expect (cursor.sort.calledWith (sinon.match ({ test: 1 }))).to.be.true ();
					expect (cursor.skip.called).to.be.false ();
					expect (cursor.limit.called).to.be.false ();
					done ();
				} catch (e) {
					done (e);
				}
			});
		});

		it ('should perform limit query', done => {
			cursor.skip.returns (cursor);
			cursor.limit.returns (cursor);
			server.methods.search (collection, { test: 1, start: 20, limit: 20 }, [ 'test' ]).then (() => {
				try {
					expect (cursor.sort.called).to.be.false ();
					expect (cursor.skip.calledWith (20)).to.be.true ();
					expect (cursor.limit.calledWith (20)).to.be.true ();
					done ();
				} catch (e) {
					done (e);
				}
			});
		});

		it ('should handle query failure', () => {
			sandbox.stub (cursor, 'count', () => Promise.reject ('err'));
			return expect (server.methods.search (collection, { test: 1 }, [ 'test' ])).to.be.rejected ();
		});
	});
});
