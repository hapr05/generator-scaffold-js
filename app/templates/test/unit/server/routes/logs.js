(function () {
	'use strict';

	const chai = require ('chai'),
		expect = chai.expect,
		dirtyChai = require ('dirty-chai'),
		chaiAsPromised = require ('chai-as-promised'),
		mockery = require ('mockery'),
		hapi = require ('hapi'),
		jwt = require ('hapi-auth-jwt2'),
		admin = require ('../../helpers/authAdmin');

	chai.use (chaiAsPromised);
	chai.use (dirtyChai);

	describe ('logs route', () => {
		var server,
			fs = {
				readdir (path, cb) {
					cb ('err');
				}
			};

		beforeEach (() => {
			server = new hapi.Server ();
			server.connection ();
			return expect (server.register ([ require ('inert'), jwt, admin ]).then (() => {
            server.auth.strategy ('jwt', 'succeed');
				server.route (require ('../../../../src/server/routes/logs'));
			})).to.be.fulfilled ();
		});

		describe ('item', () => {
			before (() => {
				mockery.enable ({
					warnOnReplace: false,
					warnOnUnregistered: false,
					useCleanCache: true
				});

				mockery.registerMock ('fs', fs);
			});

			after (() => {
				mockery.deregisterAll ();
				mockery.disable ();
			});

			it ('should fail to return a log file that does not exist', (done) => {
				server.inject ({ method: 'GET', url: '/logs/test' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (500);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});
		});

		describe ('collection', () => {
			it ('should list log files', (done) => {
				server.inject ({ method: 'GET', url: '/logs/' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});
		});

		describe ('collection', () => {
			before (() => {
				mockery.enable ({
					warnOnReplace: false,
					warnOnUnregistered: false,
					useCleanCache: true
				});

				mockery.registerMock ('fs', fs);
			});

			after (() => {
				mockery.deregisterAll ();
				mockery.disable ();
			});

			it ('should error on directory failure', (done) => {
				server.inject ({ method: 'GET', url: '/logs/' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (500);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});
		});
	});
} ());
