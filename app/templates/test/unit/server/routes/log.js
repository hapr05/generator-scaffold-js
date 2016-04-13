'use strict';

const chai = require ('chai'),
	expect = chai.expect,
	dirtyChai = require ('dirty-chai'),
	chaiAsPromised = require ('chai-as-promised'),
	sinon = require ('sinon'),
	hapi = require ('hapi'),
	creds = require ('../../helpers/creds'),
	failed = require ('../../helpers/authFailed');

chai.use (chaiAsPromised);
chai.use (dirtyChai);

describe ('log route', () => {
	var server,
		sandbox = sinon.sandbox.create ();

	beforeEach (() => {
		server = new hapi.Server ();
		server.connection ();
		return expect (server.register ([ require ('hapi-mongodb'), require ('vision'), failed ]).then (() => {
			require ('../../../../src/server/methods') (server);
			server.auth.strategy ('jwt', 'failed');
			server.route (require ('../../../../src/server/routes/log'));
		})).to.be.fulfilled ();
	});

	afterEach (() => {
		sandbox.restore ();
	});

	describe ('collection', () => {
		it ('should list log entries', done => {
			sinon.stub (server.methods, 'search').returns (Promise.resolve ({
				count: 1,
				values: [{}]
			}));

			server.inject ({
				method: 'GET',
				url: '/log/?from=2016-03-30T05:00:00.000Z&to=2016-03-31T04:59:59.999Z',
				credentials: creds.admin
			}).then (response => {
				expect (response.statusCode).to.equal (200);
				done ();
			}).catch (err => {
				done (err);
			});
		});

		it ('should handle db failure ', done => {
			sinon.stub (server.methods, 'search').returns (Promise.reject ('err'));

			server.inject ({
				method: 'GET',
				url: '/log/?from=2016-03-30T05:00:00.000Z&to=2016-03-31T04:59:59.999Z',
				credentials: creds.admin
			}).then (response => {
				expect (response.statusCode).to.equal (500);
				done ();
			}).catch (err => {
				done (err);
			});
		});

		it ('should list log entries by event', done => {
			sinon.stub (server.methods, 'search').returns (Promise.resolve ({
				count: 1,
				values: [{}]
			}));

			server.inject ({
				method: 'GET',
				url: '/log/?from=2016-03-30T05:00:00.000Z&to=2016-03-31T04:59:59.999Z&event=log',
				credentials: creds.admin
			}).then (response => {
				expect (response.statusCode).to.equal (200);
				done ();
			}).catch (err => {
				done (err);
			});
		});
	});
});
