(function () {
	'use strict';

	const joi = require ('joi'),
		boom = require ('boom');

	module.exports = [{
		method: 'GET',
		path: '/logs/',
		config: {
			auth: {
				strategy: 'jwt',
				scope: [ 'ROLE_ADMIN' ]
			},
			description: 'Retrieve log file list',
			tags: [ 'api', 'logs' ],
			validate: {
				query: joi.object ({
					from: joi.date ().required (),
					to: joi.date ().required (),
					event: joi.string ().valid ('error', 'log', 'ops', 'request', 'response').optional ()
				}).required ()
			},
			plugins: {
				'hapi-swaggered': {
					produces: [ 'text/plain' ],
					responses: {
						200: {
							description: 'Success',
							schema: joi.object ({
							})
						},
						500: {
							description: 'Internal Server Error'
						}
					}
				}
			},
			handler: (request, reply) => {
				const logs = request.server.plugins ['hapi-mongodb' ].db.collection ('logs');
				var query = {
					$and: [
						{ timestamp: { $gte: request.query.from.getTime () }},
						{ timestamp: { $lte: request.query.to.getTime () }}
					]
				};

				if (request.query.event) {
					query.event = request.query.event;
				}

				logs.find (query).sort({
					$natural: 1
				}).toArray ().then ((logs) => {
					reply (logs).code (200);
				}).catch (() => {
					reply (boom.badImplementation ());
				});
			}
		}
	}];
} ());
