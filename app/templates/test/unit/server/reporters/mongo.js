'use strict';

const hoek = require ('hoek'),
	chai = require ('chai'),
	expect = chai.expect,
	dirtyChai = require ('dirty-chai'),
	chaiAsPromised = require ('chai-as-promised'),
	stream = require ('stream'),
	mocks = require ('../../helpers/mocks'),
	Mongo = require ('../../../../src/server/reporters/mongo');

chai.use (chaiAsPromised);
chai.use (dirtyChai);

describe ('Mongo reporter', () => {
	var log = {
		insertOne () {
			return Promise.resolve (true);
		}
	};

	before (() => {
		mocks.server ('../', { log });
	});

	after (() => {
		mocks.disable ();
	});

	describe ('collection', () => {
		it ('should log entries', done => {
			const reporter = new Mongo (),
				reader = new stream.Readable ({ objectMode: true });

			reader._read = hoek.ignore;

			reporter.init (reader, null, error => {
				expect (error).to.not.exist ();

				reader.push ({ event: 'request', id: 1, timestamp: Date.now () });
				reader.push (null);
				done ();
			});
		});
	});
});
