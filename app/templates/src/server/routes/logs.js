(function () {
	'use strict';

	const joi = require ('joi'),
		fs = require ('fs'),
		path = require ('path'),
		boom = require ('boom');

	module.exports = [{
		method: 'GET',
		path: '/logs/{file}',
		config: {
			auth: {
				strategy: 'jwt',
				scope: [ 'ROLE_ADMIN' ]
			},
			description: 'Retrieve log file list',
			tags: [ 'api', 'logs' ],
			validate: {
				params: joi.object ({
					file: joi.string ().required ()
				}).required ()
			},
			plugins: {
				'hapi-swaggered': {
					produces: [ 'text/plain' ],
					responses: {
						200: {
							type: 'string',
							description: 'Success',
							schema: joi.string ()
						},
						404: {
							description: 'Not Found'
						},
						500: {
							description: 'Internal Server Error'
						}
					}
				}
			},
			handler: (request, reply) => {
				reply.file (path.join (__dirname, '../../../logs', path.basename (request.params.file)));
			}
		}
	}, {
		method: 'GET',
		path: '/logs/',
		config: {
			auth: {
				strategy: 'jwt',
				scope: [ 'ROLE_ADMIN' ]
			},
			description: 'Retrieve log file list',
			tags: [ 'api', 'logs' ],
			plugins: {
				'hapi-swaggered': {
					responses: {
						200: {
							type: 'array',
							description: 'Success',
							schema: joi.array ().items (joi.string ())
						},
						500: {
							description: 'Internal Server Error'
						}
					}
				}
			},
			response: {
				status: {
					200: joi.array ().items (joi.string ()),
				}
			},
			handler: (request, reply) => {
				fs.readdir (path.join (__dirname, '../../../logs'), (err, files) => {
					if (err) {
						reply (boom.badImplementation ());
					} else {
						reply (files).code (200);
					}
				});
			}
		}
	}];
} ());
