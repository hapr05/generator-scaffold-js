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

	function _socialAuth (<% if (socialLogins.length) { %>server, fail<% } %>) {<% for (var i = 0; i < socialLogins.length; i++) { %>
		server.auth.strategy ('<%= socialLogins [i].name %>', '<%= socialLogins [i].name %>' === fail ? 'failed' : 'succeed');<% } %>
	}

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
			})).to.be.fulfilled ();
		});

		afterEach (() => {
			sandbox.restore ();
		});

		after (() => {
			mockery.deregisterAll ();
			mockery.disable ();
		});

		describe ('internal', () => {
			it ('should authenticate valid user', (done) => {
				_socialAuth (server);
				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'POST', url: '/authenticate', payload: { username: 'admin', password: 'admin'}}).then ((response) => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (err) {
						done (err);
					}
				});
			});

			it ('should refresh token', (done) => {
				_socialAuth (server);
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

				_socialAuth (server);
				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'POST', url: '/authenticate', payload: { username: 'fake', password: 'fake'}}).then ((response) => {
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
	
				_socialAuth (server);
				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'POST', url: '/authenticate', payload: { username: 'fake', password: 'fake'}}).then ((response) => {
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
					_socialAuth (server);
					server.route (require ('../../../../src/server/routes/authenticate'));
					server.inject ({ method: 'GET', url: '/authenticate/<%= socialLogins [i].name %>' }).then ((response) => {
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
					_socialAuth (server);
					server.route (require ('../../../../src/server/routes/authenticate'));
					server.inject ({ method: 'GET', url: '/authenticate/<%= socialLogins [i].name %>' }).then ((response) => {
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
					_socialAuth (server, '<%= socialLogins [i].name %>');
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
					_socialAuth (server);
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
			});<% if (i !== socialLogins.length - 1) { %>
<% } %><% } %>
		});<% } %>
	});
} ());
