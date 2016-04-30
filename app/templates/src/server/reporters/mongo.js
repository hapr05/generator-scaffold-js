/**
 * @namespace server.reporters.mongo
 */
'use strict';

const through = require ('through2'),
	hoek = require ('hoek');

module.exports = function exports () {
	/**
	 * Intitializes the MongoDb log reporter
	 * @function server.reporters.mongo.init
	 * @param {Stream} stream - the logging stream
	 * @param {Object} emitter - the event emitter
	 * @param {Function} callback - done callback
	 */
	this.init = function init (stream, emitter, callback) {
		const server = require ('../');

		// the following callback is requires an object
		/* eslint-disable prefer-arrow-callback */
		stream.pipe (through.obj (function pipe (data, enc, next) {
			const db = server.instance ().plugins ['hapi-mongodb'].db,
				log = db.collection ('log');

			log.insertOne (hoek.clone (data));
			return next ();
		})).pipe (process.stdout);
		/* eslint-enable prefer-arrow-callback */

		callback ();
	};
};
