'use strict';

const through = require ('through2'),
	hoek = require ('hoek');

module.exports = function () { };

module.exports.prototype.init = function (stream, emitter, callback) {
	const server = require ('../');

	// the following callback is requires an object
	stream.pipe (through.obj (function pipe (data, enc, next) { // jscs:ignore requireArrowFunctions
		const db = server.instance ().plugins [ 'hapi-mongodb' ].db,
			log = db.collection ('log');

		log.insertOne (hoek.clone (data));
		return next ();
	})).pipe (process.stdout);

	callback ();
};
