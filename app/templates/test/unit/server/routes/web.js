(function () {
	'use strict';

	const chai = require ('chai'),
		expect = chai.expect,
		chaiAsPromised = require ('chai-as-promised'),
		hapi = require ('hapi'),
		inert = require ('inert'),
		web = require ('../../../../src/server/routes/web');

	chai.use (chaiAsPromised);

	describe ('web route', () => {
		var server;

		beforeEach (() => {
			server = new hapi.Server ();
			server.connection ();
			return expect (server.register ([ inert, web ])).to.be.fulfilled;
		});

		it ('should show index', () => {
			return expect (server.inject ({ method: 'GET', url: '/' })).to.eventually.have.deep.property ('statusCode', 200);
		});
	});
} ());
