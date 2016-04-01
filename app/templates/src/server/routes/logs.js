(function () {
	'use strict';

	const boom = require ('boom'),
		logsModel = require ('../models/logs');

	module.exports = [{
		method: 'GET',
		path: '/logs/',
		config: {
			auth: {
				strategy: 'jwt',
				scope: [ 'ROLE_ADMIN' ]
			},
			description: 'Search Log Entries',
			notes: 'Searches for log entries by date and optionally, event type',
			tags: [ 'api', 'logs' ],
			validate: {
				query: logsModel.search
			},
			plugins: {
				'hapi-swaggered': {
					responses: {
						200: {
							description: 'Success',
							schema: logsModel.logEntryBecauseOpenAPISpecDoesntSupportAlternatives
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
