(function () {
	'use strict';

	function implementation () {
		return {
			authenticate (request, reply) {
				return reply.continue ({
					credentials: {
						username: 'test',
						profile: {
							id: 'test',
							username: 'test',
							displayName: 'test',
							email: 'test',
							name: {
								first: 'test'
							},
							raw: {
								lang: 'en'
							}
						},
						scope: [ 'ROLE_ADMIN' ]
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
