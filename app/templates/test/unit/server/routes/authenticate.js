(function () {
	'use strict';

	const chai = require ('chai'),
		expect = chai.expect,
		dirtyChai = require ('dirty-chai'),
		chaiAsPromised = require ('chai-as-promised'),
		sinon = require ('sinon'),
		mockery = require ('mockery'),
		hapi = require ('hapi'),
		jwt = require ('hapi-auth-jwt2');

	chai.use (chaiAsPromised);
	chai.use (dirtyChai);

	describe ('authentication route', () => {
		var server,
			users = {
				findOne () {
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
			return expect (server.register ([ require ('hapi-mongodb'), jwt ]).then (() => {
				server.route (require ('../../../../src/server/routes/authenticate'));
			})).to.be.fulfilled ();
		});

		afterEach (() => {
			sandbox.restore ();
		});

		after (() => {
			mockery.deregisterAll ();
			mockery.disable ();
		});

		it ('should authenticate valid user', (done) => {
			server.inject ({ method: 'POST', url: '/authenticate', payload: { username: 'admin', password: 'admin'}}).then ((response) => {
				done ();
				expect (response.statusCode).to.equal (200);
			});
		});

		it ('should refresh token', (done) => {
			server.inject ({ method: 'GET', url: '/authenticate', credentials: { user: { id: '1' }}}).then ((response) => {
				done ();
				expect (response.statusCode).to.equal (200);
			});
		});

		it ('should fail to authenticate invalid user', (done) => {
			sandbox.stub (users, 'findOne', () => {
				return Promise.resolve (null);
			});

			server.inject ({ method: 'POST', url: '/authenticate', payload: { username: 'fake', password: 'fake'}}).then ((response) => {
				done ();
				expect (response.statusCode).to.equal (401);
			});
		});

		it ('should fail to authenticate on db error', (done) => {
			sandbox.stub (users, 'findOne', () => {
				return Promise.reject ('err');
			});

			server.inject ({ method: 'POST', url: '/authenticate', payload: { username: 'fake', password: 'fake'}}).then ((response) => {
				done ();
				expect (response.statusCode).to.equal (401);
			});
		});
	});
} ());
