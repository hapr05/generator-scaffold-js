(function () {
	'use strict';

	const chai = require ('chai'),
		expect = chai.expect,
		dirtyChai = require ('dirty-chai'),
		chaiAsPromised = require ('chai-as-promised'),
		sinon = require ('sinon'),
		hapi = require ('hapi'),
		jwt = require ('hapi-auth-jwt2'),
		mocks = require ('../../helpers/mocks'),
		admin = require ('../../helpers/authAdmin');

	chai.use (chaiAsPromised);
	chai.use (dirtyChai);

	describe ('logs route', () => {
		var server,
			logs = {
				find () {
					return {
						sort () {
							return {
								toArray () {
									return Promise.resolve (true);
								}
							};
						}
					};
				}
			},
			sandbox = sinon.sandbox.create ();

		before (() => {
			mocks.mongo ({ logs: logs });
		});

		beforeEach (() => {
			server = new hapi.Server ();
			server.connection ();
			return expect (server.register ([ require ('hapi-mongodb'), require ('vision'), jwt, admin ]).then (() => {
            server.auth.strategy ('jwt', 'admin');
				server.route (require ('../../../../src/server/routes/logs'));
			})).to.be.fulfilled ();
		});

		afterEach (() => {
			sandbox.restore ();
		});

		after (() => {
			mocks.disable ();
		});

		describe ('collection', () => {
			it ('should list log entries', (done) => {
				server.inject ({
					method: 'GET',
					url: '/logs/?from=2016-03-30T05:00:00.000Z&to=2016-03-31T04:59:59.999Z'
				}).then ((response) => {
						expect (response.statusCode).to.equal (200);
						done ();
				}).catch ((err) => {
					done (err);
				});
			});

			it ('should handle db failure ', (done) => {
				sandbox.stub (logs, 'find', () => {
					return {
						sort () {
							return {
								toArray () {
									return Promise.reject (true);
								}
							};
						}
					};
				});
	
				server.inject ({
					method: 'GET',
					url: '/logs/?from=2016-03-30T05:00:00.000Z&to=2016-03-31T04:59:59.999Z'
				}).then ((response) => {
						expect (response.statusCode).to.equal (500);
						done ();
				}).catch ((err) => {
					done (err);
				});
			});

			it ('should list log entries by event', (done) => {
				server.inject ({
					method: 'GET',
					url: '/logs/?from=2016-03-30T05:00:00.000Z&to=2016-03-31T04:59:59.999Z&event=log'
				}).then ((response) => {
					expect (response.statusCode).to.equal (200);
					done ();
				}).catch ((err) => {
					done (err);
				});
			});
		});
	});
} ());
