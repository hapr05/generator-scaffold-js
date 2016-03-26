(function () {
	'use strict';

	const boom = require ('boom');

	function implementation () {
		return {
			authenticate (request, reply) {
				return reply (boom.unauthorized ());
			}
		};
	}

	module.exports = {
		register (server, options, next) {
			server.auth.scheme ('failed', implementation);
			next();
		}
	};

	module.exports.register.attributes = {
		name: 'failed',
		version: '0.0.1'
	};
} ());
