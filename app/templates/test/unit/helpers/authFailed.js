(function () {
	'use strict';

	function implementation () {
		return {
			authenticate (request, reply) {
				return reply ().code (401);
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
