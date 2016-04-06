'use strict';

const chai = require ('chai'),
	expect = chai.expect,
	dirtyChai = require ('dirty-chai'),
	chaiAsPromised = require ('chai-as-promised'),
	hapi = require ('hapi'),
	inert = require ('inert'),
	web = require ('../../../../src/server/routes/web');

chai.use (chaiAsPromised);
chai.use (dirtyChai);

describe ('web route', () => {
	var server;

	beforeEach (() => {
		server = new hapi.Server ();
		server.connection ();
		return expect (server.register ([ inert ]).then (() => {
			server.route (web);
		})).to.be.fulfilled ();
	});

	it ('should show index', () => expect (server.inject ({ method: 'GET', url: '/' })).to.eventually.have.deep.property ('statusCode', 200));
});
