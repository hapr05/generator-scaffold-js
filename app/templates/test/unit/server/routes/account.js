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
			},
			updateOne () {
				return Promise.resolve (true);
			}
		},
		sandbox = sinon.sandbox.create ();

	before (() => {
		mocks.mongo ({ users });
	});

	beforeEach (() => {
		server = new hapi.Server ();
		server.connection ();
		return expect (server.register ([ require ('hapi-mongodb'), require ('vision'), failed ]).then (() => {
			require ('../../../../src/server/methods') (server);
			server.auth.strategy ('jwt', 'failed');
			server.route (require ('../../../../src/server/routes/account'));
		})).to.be.fulfilled ();
	});

	afterEach (() => {
		sandbox.restore ();
	});

	after (() => {
		mocks.disable ();
	});

	describe ('item', () => {
		describe ('retrieve', () => {
			it ('should retrieve an account', done => {
				server.inject ({ method: 'GET', url: '/account/user', credentials: creds.user }).then (response => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should retrieve an account as admin', done => {
				server.inject ({ method: 'GET', url: '/account/user', credentials: creds.admin }).then (response => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should fail if not authorized', done => {
				sandbox.stub (users, 'findOne', () => Promise.resolve (null));

				server.inject ({ method: 'GET', url: '/account/admin', credentials: creds.user }).then (response => {
					try {
						expect (response.statusCode).to.equal (403);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should fail if no account', done => {
				sandbox.stub (users, 'findOne', () => Promise.resolve (null));

				server.inject ({ method: 'GET', url: '/account/user', credentials: creds.user }).then (response => {
					try {
						expect (response.statusCode).to.equal (404);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should fail on error', done => {
				sandbox.stub (users, 'findOne', () => Promise.reject ('err'));

				server.inject ({ method: 'GET', url: '/account/user', credentials: creds.user }).then (response => {
					try {
						expect (response.statusCode).to.equal (500);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});
		});

		describe ('update', () => {
			it ('should update an account', done => {
				server.inject ({
					method: 'POST',
					url: '/account/user',
					credentials: creds.user,
					payload: {
						email: 'test@localhost',
						active: true,
						scope: [ 'ROLE_USER' ]
					}
				}).then (response => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should update an account as admin', done => {
				server.inject ({
					method: 'POST',
					url: '/account/user',
					credentials: creds.admin,
					payload: {
						password: 'AAbb11$$',
						active: true,
						scope: [ 'ROLE_USER' ]
					}
				}).then (response => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should fail update an account if not authorized', done => {
				server.inject ({
					method: 'POST',
					url: '/account/admin',
					credentials: creds.user,
					payload: {}
				}).then (response => {
					try {
						expect (response.statusCode).to.equal (403);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should fail update an account if update fails', done => {
				sandbox.stub (users, 'updateOne', () => Promise.reject ('err'));

				server.inject ({
					method: 'POST',
					url: '/account/user',
					credentials: creds.user,
					payload: {
						email: 'test@localhost'
					}
				}).then (response => {
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

	describe ('collection', () => {
		it ('should validate accounts', done => {
			sinon.stub (server.methods, 'search').returns (Promise.resolve ({
				count: 1,
				values: [{}]
			}));

			server.inject ({ method: 'GET', url: '/account/', credentials: creds.user }).then (response => {
				try {
					expect (response.statusCode).to.equal (204);
					done ();
				} catch (err) {
					done (err);
				}
			});
		});

		it ('should list accounts', done => {
			sinon.stub (server.methods, 'search').returns (Promise.resolve ({
				count: 1,
				values: [{
					_id: 'user'
				}]
			}));
			server.inject ({ method: 'GET', url: '/account/', credentials: creds.user }).then (response => {
				try {
					expect (response.statusCode).to.equal (200);
					done ();
				} catch (err) {
					done (err);
				}
			});
		});

		it ('should list accounts admin', done => {
			sinon.stub (server.methods, 'search').returns (Promise.resolve ({
				count: 1,
				values: [{}]
			}));
			server.inject ({ method: 'GET', url: '/account/', credentials: creds.admin }).then (response => {
				try {
					expect (response.statusCode).to.equal (200);
					done ();
				} catch (err) {
					done (err);
				}
			});
		});

		it ('should handle empty list', done => {
			sinon.stub (server.methods, 'search').returns (Promise.resolve ({ count: 0 }));
			server.inject ({ method: 'GET', url: '/account/', credentials: creds.user }).then (response => {
				try {
					expect (response.statusCode).to.equal (404);
					done ();
				} catch (err) {
					done (err);
				}
			});
		});

		it ('should error on list failure', done => {
			sinon.stub (server.methods, 'search').returns (Promise.reject ('err'));
			server.inject ({ method: 'GET', url: '/account/', credentials: creds.user }).then (response => {
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
		it ('should create an account', done => {
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
			}).then (response => {
				try {
					expect (response.statusCode).to.equal (200);
					done ();
				} catch (err) {
					done (err);
				}
			});
		});

		it ('should error on list failure', done => {
			sandbox.stub (users, 'insertOne', () => Promise.reject ('err'));

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
			}).then (response => {
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
