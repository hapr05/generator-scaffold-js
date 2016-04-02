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

	describe ('authentication route', () => {
		var server,
			users = {
				findOne () {
					return Promise.resolve (true);
				},
				insertOne () {
					return 'test';
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
            server.method ('audit', () => {});
            server.auth.strategy ('jwt', 'failed');<% if (socialLogins.length) { for (var i = 0; i < socialLogins.length; i++) { %>
				server.auth.strategy ('<%= socialLogins [i].name %>', 'failed');<% }} %>
			})).to.be.fulfilled ();
		});

		afterEach (() => {
			sandbox.restore ();
		});

		after (() => {
			mocks.disable ();
		});

		describe ('internal', () => {
			it ('should authenticate valid user', (done) => {
				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'POST', url: '/authenticate', payload: { username: 'admin', password: 'admin'}, credentials: creds.user }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should refresh token', (done) => {
				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'GET', url: '/authenticate', credentials: { user: { id: '1' }}}).then ((response) => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should fail to authenticate invalid user', (done) => {
				sandbox.stub (users, 'findOne', () => {
					return Promise.resolve (null);
				});

				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'POST', url: '/authenticate', payload: { username: 'fake', password: 'fake'}, credentials: creds.user }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (401);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should fail to authenticate on db error', (done) => {
				sandbox.stub (users, 'findOne', () => {
					return Promise.reject ('err');
				});
	
				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'POST', url: '/authenticate', payload: { username: 'fake', password: 'fake'}, credentials: creds.user }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (401);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});
		});<% if (socialLogins.length) { %>	

		describe ('social', () => {<% for (var i = 0; i < socialLogins.length; i++) { %>
			describe ('<%= socialLogins [i].name %>', () => {
				it ('should authenticate <%= socialLogins [i].name %> user', (done) => {
					sandbox.stub (users, 'findOne', () => {
						return Promise.resolve (null);
					});

					server.views ({
						engines: {
							html: require ('handlebars')
						},
						relativeTo: __dirname,
						path: '../../../../src/server/views'
					});
					server.route (require ('../../../../src/server/routes/authenticate'));
					server.inject ({ method: 'GET', url: '/authenticate/<%= socialLogins [i].name %>', credentials: creds.user  }).then ((response) => {
						try {
							expect (response.statusCode).to.equal (200);
							done ();
						} catch (e) {
							done (e);
						}
					}).catch ((e) => {
						done (e);
					});
				});

				it ('should reauthenticate <%= socialLogins [i].name %> user', (done) => {
					server.views ({
						engines: {
							html: require ('handlebars')
						},
						relativeTo: __dirname,
						path: '../../../../src/server/views'
					});
					server.route (require ('../../../../src/server/routes/authenticate'));
					server.inject ({ method: 'GET', url: '/authenticate/<%= socialLogins [i].name %>', credentials: creds.user  }).then ((response) => {
						try {
							expect (response.statusCode).to.equal (200);
							done ();
						} catch (e) {
							done (e);
						}
					}).catch ((e) => {
						done (e);
					});
				});

				it ('should fail to authenticate <%= socialLogins [i].name %> user', (done) => {
					server.route (require ('../../../../src/server/routes/authenticate'));
					server.inject ({ method: 'GET', url: '/authenticate/<%= socialLogins [i].name %>' }).then ((response) => {
						try {
							expect (response.statusCode).to.equal (401);
							done ();
						} catch (e) {
							done (e);
						}
					}).catch ((e) => {
						done (e);
					});
				});

				it ('should handle view failure', (done) => {
					server.route (require ('../../../../src/server/routes/authenticate'));
					server.inject ({ method: 'GET', url: '/authenticate/<%= socialLogins [i].name %>', credentials: creds.user  }).then ((response) => {
						try {
							expect (response.statusCode).to.equal (401);
							done ();
						} catch (e) {
							done (e);
						}
					}).catch ((e) => {
						done (e);
					});
				});
			});<% if (i !== socialLogins.length - 1) { %>
<% } %><% } %>
		});<% } %>
	});
} ());
