(function () {
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

	describe ('audit route', () => {
		var server,
			audit = {
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
			mocks.mongo ({ audit: audit });
		});

		beforeEach (() => {
			server = new hapi.Server ();
			server.connection ();
			return expect (server.register ([ require ('hapi-mongodb'), require ('vision'), failed ]).then (() => {
            server.auth.strategy ('jwt', 'failed');
            server.method ('audit', () => {});
				server.route (require ('../../../../src/server/routes/audit'));
			})).to.be.fulfilled ();
		});

		afterEach (() => {
			sandbox.restore ();
		});

		after (() => {
			mocks.disable ();
		});

		describe ('collection', () => {
			it ('should list audit entries', (done) => {
				server.inject ({
					method: 'GET',
					url: '/audit/?from=2016-03-30T05:00:00.000Z&to=2016-03-31T04:59:59.999Z',
					credentials: creds.admin
				}).then ((response) => {
						expect (response.statusCode).to.equal (200);
						done ();
				}).catch ((err) => {
					done (err);
				});
			});

			it ('should handle db failure ', (done) => {
				sandbox.stub (audit, 'find', () => {
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
					url: '/audit/?from=2016-03-30T05:00:00.000Z&to=2016-03-31T04:59:59.999Z',
					credentials: creds.admin
				}).then ((response) => {
						expect (response.statusCode).to.equal (500);
						done ();
				}).catch ((err) => {
					done (err);
				});
			});

			it ('should list audit entries by event/username', (done) => {
				server.inject ({
					method: 'GET',
					url: '/audit/?from=2016-03-30T05:00:00.000Z&to=2016-03-31T04:59:59.999Z&event=create&username=test',
					credentials: creds.admin
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
