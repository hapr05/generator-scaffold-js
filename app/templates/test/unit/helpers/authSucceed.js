(function () {
	'use strict';

	function implementation () {
		return {
			authenticate (request, reply) {
				return reply.continue ({
					credentials: {
						username: 'test',
						profile: {
							username: 'test',
							displayName: 'test',
							email: 'test'
						}
					}
				});
			}
		};
	}

	module.exports = {
		register (server, options, next) {
			server.auth.scheme ('succeed', implementation);
			next();
		}
	};

	module.exports.register.attributes = {
		name: 'succeded',
		version: '0.0.1'
	};
} ());
