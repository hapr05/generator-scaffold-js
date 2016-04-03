(function () {
	'use strict';

	const chai = require ('chai'),
		expect = chai.expect,
		dirtyChai = require ('dirty-chai'),
		chaiAsPromised = require ('chai-as-promised'),
		sinon = require ('sinon'),
		hapi = require ('hapi'),
		mocks = require ('../../helpers/mocks'),
		mockery = require ('mockery'),
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
				updateOne () {
					return Promise.resolve (true);
				},
				insertOne () {
					return 'test';
				}
			},
			jwt = {
				sign () {
				},
				verify (token, key, options, callback) {
					callback (false, {
						_id: 'id'
					});
				}
			},
			sandbox = sinon.sandbox.create ();

		before (() => {
			mocks.mongo ({ users: users });
			mockery.registerMock ('jsonwebtoken', jwt);
		});

		beforeEach (() => {
			server = new hapi.Server ();
			server.connection ();
			return expect (server.register ([ require ('hapi-mongodb'), require ('vision'), failed, require ('hapi-mailer')]).then (() => {
            server.method ('audit', () => {});
            server.auth.strategy ('jwt', 'failed');<% if (socialLogins.length) { for (var i = 0; i < socialLogins.length; i++) { %>
				server.auth.strategy ('<%= socialLogins [i].name %>', 'failed');<% }} %>
				server.route (require ('../../../../src/server/routes/authenticate'));
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
				server.inject ({ method: 'POST', url: '/authenticate', payload: { username: 'admin', password: 'admin'}, credentials: creds.user }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			describe ('forgot replace', () => {
				it ('should update password', (done) => {
					server.inject ({ method: 'POST', url: '/authenticate/forgot', payload: { token: 'token', password: 'ABcd02$$' }}).then ((response) => {
						try {
							expect (response.statusCode).to.equal (200);
							done ();
						} catch (err) {
							done (err);
						}
					});
				});

				it ('should handle invalid token', (done) => {
					sandbox.stub (jwt, 'verify', (token, key, options, callback) => {
						callback (true);
					});

					server.inject ({ method: 'POST', url: '/authenticate/forgot', payload: { token: 'token', password: 'ABcd02$$' }}).then ((response) => {
						try {
							expect (response.statusCode).to.equal (401);
							done ();
						} catch (err) {
							done (err);
						}
					});
				});

				it ('should handle update failure', (done) => {
					sandbox.stub (users, 'updateOne', () => {
						return Promise.reject ();
					});

					server.inject ({ method: 'POST', url: '/authenticate/forgot', payload: { token: 'token', password: 'ABcd02$$' }}).then ((response) => {
						try {
							expect (response.statusCode).to.equal (401);
							done ();
						} catch (err) {
							done (err);
						}
					});
				});
			});

			describe ('forgot email', () => {
				it ('should send forgot password email', (done) => {
					sandbox.stub (server.plugins.mailer, 'sendMail', (optoins, callback) => {
						callback ();
					});

					server.inject ({ method: 'POST', url: '/authenticate/forgot', payload: { email: 'user@localhost' }}).then ((response) => {
						try {
							expect (response.statusCode).to.equal (200);
							done ();
						} catch (err) {
							done (err);
						}
					});
				});

				it ('should ignore forgot password if email fails', (done) => {
					server.inject ({ method: 'POST', url: '/authenticate/forgot', payload: { email: 'user@localhost' }}).then ((response) => {
						try {
							expect (response.statusCode).to.equal (200);
							done ();
						} catch (err) {
							done (err);
						}
					});
				});

				it ('should ignore forgot password if no user', (done) => {
					sandbox.stub (users, 'findOne', () => {
						return Promise.resolve (null);
					});

					server.inject ({ method: 'POST', url: '/authenticate/forgot', payload: { email: 'user@localhost' }}).then ((response) => {
						try {
							expect (response.statusCode).to.equal (200);
							done ();
						} catch (err) {
							done (err);
						}
					});
				});

				it ('should ignore forgot password on db error', (done) => {
					sandbox.stub (users, 'findOne', () => {
						return Promise.reject ('err');
					});

					server.inject ({ method: 'POST', url: '/authenticate/forgot', payload: { email: 'user@localhost' }}).then ((response) => {
						try {
							expect (response.statusCode).to.equal (200);
							done ();
						} catch (err) {
							done (err);
						}
					});
				});
			});

			it ('should refresh token', (done) => {
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
