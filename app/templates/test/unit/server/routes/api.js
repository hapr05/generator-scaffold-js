(function (require) {
	'use strict';

	const chai = require ('chai'),
		expect = chai.expect,
		chaiAsPromised = require ('chai-as-promised'),
		hapi = require ('hapi'),
		api = require ('../../../../src/server/routes/api');

	chai.use (chaiAsPromised);

	describe ('api route', () => {
		var server;

		beforeEach (() => {
			server = new hapi.Server ();
			server.connection ();
			return expect (server.register ([ api ])).to.be.fulfilled;
		});

		it ('should log response', (done) => {
			server.inject ({ method: 'GET', url: '/' }).then (() => {
				done ();
			});
		});

		it ('should show index', () => {
			return expect (server.inject ({ method: 'GET', url: '/' })).to.eventually.have.deep.property ('statusCode', 200);
		});
	});
} (require));
