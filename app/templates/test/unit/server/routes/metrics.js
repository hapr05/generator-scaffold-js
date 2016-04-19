'use strict';

const chai = require ('chai'),
	expect = chai.expect,
	dirtyChai = require ('dirty-chai'),
	chaiAsPromised = require ('chai-as-promised'),
	sinon = require ('sinon'),
	hapi = require ('hapi'),
	mocks = require ('../../helpers/mocks'),
	creds = require ('../../helpers/creds'),
	failed = require ('../../helpers/authFailed');

chai.use (chaiAsPromised);
chai.use (dirtyChai);

describe ('metrics route', () => {
	var server,
		metrics = {
			find: () => ({
				sort: () => ({
					toArray: () => Promise.resolve (true)
				})
			})
		},
		sandbox = sinon.sandbox.create (),
		db;

	before (() => {
		db = mocks.mongo ({ metrics });
	});

	beforeEach (() => {
		server = new hapi.Server ();
		server.connection ();
		return expect (server.register ([ require ('hapi-mongodb'), require ('vision'), failed ]).then (() => {
			server.method ('audit', () => {});
			server.auth.strategy ('jwt', 'failed');
			server.route (require ('../../../../src/server/routes/metrics'));
		})).to.be.fulfilled ();
	});

	afterEach (() => {
		sandbox.restore ();
	});

	after (() => {
		mocks.disable ();
	});

	describe ('collection', () => {
		it ('should retrieve metrics', done => {
			db.admin = function admin () {
				return {
					serverStatus: () => Promise.resolve ({
						metrics: {},
						backgroundFlushing: {}
					})
				};
			};

			server.inject ({
				method: 'GET',
				url: '/metrics',
				credentials: creds.admin
			}).then (response => {
				expect (response.statusCode).to.equal (200);
				done ();
			}).catch (err => {
				done (err);
			});
		});

		it ('should handle error', done => {
			db.admin = () => ({
				serverStatus: () => Promise.reject ({ metrics: {} })
			});

			server.inject ({
				method: 'GET',
				url: '/metrics',
				credentials: creds.admin
			}).then (response => {
				expect (response.statusCode).to.equal (500);
				done ();
			}).catch (err => {
				done (err);
			});
		});
	});
});
