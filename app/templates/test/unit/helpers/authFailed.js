'use strict';

const boom = require ('boom'),
	implimentation = function implementation () {
		return {
			authenticate: (request, reply) => reply (boom.unauthorized ())
		};
	};

module.exports = {
	register (server, options, next) {
		server.auth.scheme ('failed', implimentation);
		next ();
	}
};

module.exports.register.attributes = {
	name: 'failed',
	version: '0.0.1'
};
