(function () {
	'use strict';

	const joi = require ('joi');

	exports.register = function (server, options, next) {
		server.route ({
			method: 'GET',
			path: '/',
			config: {
				handler: (request, reply) => {
					reply ({
						message: '.'
					}); 
				},
				description: 'Get .',
				notes: 'notes',
				tags: [ 'api' ],
				plugins: {
					'hapi-swagger': {
						responses: {
							'200': { 'description': 'Success', 'schema': joi.object({ equals: joi.number() }).label('Result') },
							'400': {'description': 'Bad Request'}
						}
					}
				}
			}
		}); 

		next();
	};

	exports.register.attributes = { 
		name: 'api'
	};
} ());
