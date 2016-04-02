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
			sandbox = sinon.sandbox.create ();

		before (() => {
			mocks.mongo ({ users: users });
		});

		beforeEach (() => {
			server = new hapi.Server ();
			server.connection ();
			return expect (server.register ([ require ('hapi-mongodb'), require ('vision'), failed ]).then (() => {
            server.auth.strategy ('jwt', 'failed');
            server.method ('audit', () => {});
				server.route (require ('../../../../src/server/routes/account'));
			}).catch ((err) => {
				console.log (err);
			})).to.be.fulfilled ();
		});

		afterEach (() => {
			sandbox.restore ();
		});

		after (() => {
			mocks.disable ();
		});

		describe ('item', () => {
			it ('should retrieve an account', (done) => {
				server.inject ({ method: 'GET', url: '/account/test', credentials: creds.user }).then ((response) => {
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

				server.inject ({ method: 'GET', url: '/account/test', credentials: creds.user }).then ((response) => {
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

				server.inject ({ method: 'GET', url: '/account/test', credentials: creds.user }).then ((response) => {
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
				server.inject ({ method: 'GET', url: '/account/', credentials: creds.user }).then ((response) => {
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
				server.inject ({ method: 'GET', url: '/account/', credentials: creds.user }).then ((response) => {
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
				server.inject ({ method: 'GET', url: '/account/', credentials: creds.user }).then ((response) => {
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
					},
					credentials: creds.user
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
					},
					credentials: creds.user
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
