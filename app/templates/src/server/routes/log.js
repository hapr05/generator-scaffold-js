(function () {
	'use strict';

	const boom = require ('boom'),
		logModel = require ('../models/log');

	module.exports = [{
		method: 'GET',
		path: '/log/',
		config: {
			auth: {
				strategy: 'jwt',
				scope: [ 'ROLE_ADMIN' ]
			},
			description: 'Search Log Entries',
			notes: 'Searches for log entries by date and optionally, event type',
			tags: [ 'api', 'log' ],
			validate: {
				query: logModel.search
			},
			plugins: {
				'hapi-swaggered': {
					responses: {
						200: {
							description: 'Success',
							schema: logModel.logEntryBecauseOpenAPISpecDoesntSupportAlternatives
						},
						403: { description: 'Forbidden' },
						500: { description: 'Internal Server Error' }
					}
				}
			},
			handler: (request, reply) => {
				const log = request.server.plugins ['hapi-mongodb' ].db.collection ('log');
				var query = {
					$and: [
						{ timestamp: { $gte: request.query.from.getTime () }},
						{ timestamp: { $lte: request.query.to.getTime () }}
					]
				};

				if (request.query.event) {
					query.event = request.query.event;
				}

				log.find (query).sort ({
					$natural: 1
				}).toArray ().then ((log) => {
					request.server.methods.audit ('access', { id: request.auth.credentials._id, username: request.auth.credentials.username}, 'success', 'log', request.query);
					reply (log).code (200);
				}).catch (() => {
					request.server.methods.audit ('access', { id: request.auth.credentials._id, username: request.auth.credentials.username}, 'failure', 'log', request.query);
					reply (boom.badImplementation ());
				});
			}
		}
	}];
} ());
