'use strict';

const chai = require ('chai'),
	expect = chai.expect,
	dirtyChai = require ('dirty-chai'),
	chaiAsPromised = require ('chai-as-promised'),
	server = require ('../../../src/server'),
	config = require ('config');

chai.use (chaiAsPromised);
chai.use (dirtyChai);
process.env.ALLOW_CONFIG_MUTATIONS = 'true';

describe ('server', () => {
	var m = config.get ('manifest');

	beforeEach (() => {
		m.server = {};
		m.connections = [];
		m.registrations = [];
	});

	it ('should start a server', () => {
		var p = server.start ();

		p.then (() => {
			expect (server.instance ()).to.be.an ('object');
			server.stop ();
		});

		return expect (p).to.be.fulfilled;
	});

	it ('should fail to start a server with an invalid plugin', () => {
		var p;

		m.registrations = [
			{ plugin: './invalid-plugin' }
		];

		p = server.start ();
		p.then (() => {
			server.stop ();
		});

		return expect (p).to.be.rejected;
	});

	it ('should fail to start a second server on the same port', () => {
		var p;

		m.connections = [
			{ port: 8080 },
			{ port: 8080 }
		];

		p = server.start ();
		p.then (() => {
			server.stop ();
		}).catch (() => {
			/* This is a hack but the server is in an invalid state and cannot be stopped without this. */
			server._state = 'started';
			server.stop ();
		});

		return expect (p).to.be.rejected;
	});
});
