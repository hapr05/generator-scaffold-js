(function () {
	'use strict';

	const chai = require ('chai'),
		expect = chai.expect,
		dirtyChai = require ('dirty-chai'),
		chaiAsPromised = require ('chai-as-promised'),
		sinon = require ('sinon'),
		mockery = require ('mockery'),
		hapi = require ('hapi'),
		jwt = require ('hapi-auth-jwt2'),
		succeed = require ('../../helpers/authSucceed'),
		failed = require ('../../helpers/authFailed');

	chai.use (chaiAsPromised);
	chai.use (dirtyChai);

	describe ('account route', () => {
		var server,
			users = {
				find () {
					return {
						toArray () {
							return Promise.resolve ([ true ]);
						}
					};
				},
				findOne () {
					return Promise.resolve (true);
				},
				insertOne () {
					return Promise.resolve (true);
				}
			},
			db = {
				collection () { return users; }
			},
			mongo = {
				MongoClient: {
					connect (url, settings, cb) {
						cb (false, db);
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

		beforeEach (() => {
			server = new hapi.Server ();
			server.connection ();
			return expect (server.register ([ require ('hapi-mongodb'), require ('vision'), jwt, succeed, failed ]).then (() => {
            server.auth.strategy ('jwt', 'succeed');
				server.route (require ('../../../../src/server/routes/account'));
			})).to.be.fulfilled ();
		});

		afterEach (() => {
			sandbox.restore ();
		});

		after (() => {
			mockery.deregisterAll ();
			mockery.disable ();
		});

		describe ('item', () => {
			it ('should retrieve an account', (done) => {
				server.inject ({ method: 'GET', url: '/account/test' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should fail if no account', (done) => {
				sandbox.stub (users, 'findOne', () => {
					return Promise.resolve (null);
				});

				server.inject ({ method: 'GET', url: '/account/test' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (404);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should fail on error', (done) => {
				sandbox.stub (users, 'findOne', () => {
					return Promise.reject ('err');
				});

				server.inject ({ method: 'GET', url: '/account/test' }).then ((response) => {
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
			it ('should list accounts', (done) => {
				server.inject ({ method: 'GET', url: '/account/' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should handle empty list', (done) => {
				sandbox.stub (users, 'find', () => {
					return {
						toArray () {
						return Promise.resolve (null);
						}
					};
				});
				server.inject ({ method: 'GET', url: '/account/' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (404);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should error on list failure', (done) => {
				sandbox.stub (users, 'find', () => {
					return {
						toArray () {
							return Promise.reject ('err');
						}
					};
				});
				server.inject ({ method: 'GET', url: '/account/' }).then ((response) => {
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
			it ('should create an account', (done) => {
				server.inject ({
					method: 'POST',
					url: '/account/',
					payload: {
						username: 'test',
						password: 'Test123?',
						fullName: 'Test User',
						nickname: 'Test',
						email: 'test@localhost'
					}
				}).then ((response) => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should error on list failure', (done) => {
				sandbox.stub (users, 'insertOne', () => {
					return Promise.reject ('err');
				});
				server.inject ({
					method: 'POST',
					url: '/account/',
					payload: {
						username: 'test',
						password: 'Test123?',
						fullName: 'Test User',
						nickname: 'Test',
						email: 'test@localhost'
					}
				}).then ((response) => {
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
