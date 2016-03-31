(function () {
	'use strict';

	const hoek = require ('hoek'),
		chai = require ('chai'),
		expect = chai.expect,
		dirtyChai = require ('dirty-chai'),
		chaiAsPromised = require ('chai-as-promised'),
		sinon = require ('sinon'),
		mockery = require ('mockery'),
		stream = require ('stream'),
		mongo = require ('../../../../src/server/reporters/mongo');

	chai.use (chaiAsPromised);
	chai.use (dirtyChai);

	describe ('mongo reporter', () => {
		var logs = {
				insertOne () {
					return Promise.resolve (true);
				}
			},
			server = {
				instance () {
					return {
						plugins: {
							'hapi-mongodb': {
								db: {
									collection () { return logs; }
								}
							}
						}
					};
				}
			},
			sandbox = sinon.sandbox.create ();

		before (() => {
			mockery.enable ({
				warnOnReplace: false,
				warnOnUnregistered: false,
				useCleanCache: true
			});

			mockery.registerMock ('../', server);
		});

		afterEach (() => {
			sandbox.restore ();
		});

		after (() => {
			mockery.deregisterAll ();
			mockery.disable ();
		});

		describe ('collection', () => {
			it ('should log entries', (done) => {
				const reporter = new mongo (),
					reader = new stream.Readable ({ objectMode: true });
	
				reader._read = hoek.ignore;
	
				reporter.init (reader, null, function (error) {
					expect (error).to.not.exist();
	
					reader.push ({ event: 'request', id: 1, timestamp: Date.now() });
					reader.push (null);
					done ();
				});
			});
		});
	});
} ());
