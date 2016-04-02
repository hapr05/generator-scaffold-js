(function () {
	'use strict';

	const through = require ('through2'),
		hoek = require ('hoek');

	module.exports = function () { };

	module.exports.prototype.init = function (stream, emitter, callback) {
		const server = require ('../');

		stream.pipe (through.obj (function (data, enc, next) {
			const db = server.instance ().plugins ['hapi-mongodb'].db,
				log = db.collection ('log');

			log.insertOne (hoek.clone (data));
			return next ();
		})).pipe (process.stdout);

		callback ();
	};
} ());

