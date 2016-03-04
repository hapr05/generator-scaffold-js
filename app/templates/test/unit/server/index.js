(function () {
	'use strict';

	const chai = require ('chai'),
		expect = chai.expect,
		chaiAsPromised = require ('chai-as-promised'),
		server = require ('../../../src/server'),
		config = require ('config');

	chai.use (chaiAsPromised);
	process.env.ALLOW_CONFIG_MUTATIONS = 'true';

	describe ('server', () => {
		var m = config.get ('manifest');

		m.server = {};
		m.connections = m.registrations = [];

		it ('should start a server', () => {
			var p = server.start ();

			p.then (() => {
				server.stop ();
			});

			return expect (p).to.be.fulfilled;
		});

		it ('should fail to start a server with an invalid plugin', () => {
			m.registrations = [{
				plugin: './invalid-plugin'
			}];

			var p = server.start ();
			p.then (() => {
				m.registrations = [];
				server.stop ();
			}, () => {
				m.registrations = [];
			});

			return expect (p).to.be.rejected;
		});

		it ('should fail to start a second server on the same port', () => {
			m.connections = [{
				port: 8080
			}, {
				port: 8080
			}];
			var p = server.start ();
			
			p.then (() => {
				m.connections = [];
				server.stop ();
			}, () => {
				m.connections = [];
				/* This is a hack but the server is in an invalid state and cannot be stopped without this. */
				server._state = 'started';
				server.stop ();
			});
			
			return expect (p).to.be.rejected;
		});
	});
} ());
