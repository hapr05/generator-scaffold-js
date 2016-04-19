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
		handler (request, reply) {
			const log = request.server.plugins ['hapi-mongodb'].db.collection ('log');
			var query = {
				$and: [
					{ timestamp: { $gte: request.query.from.getTime () } },
					{ timestamp: { $lte: request.query.to.getTime () } }
				]
			};

			request.server.methods.search (log, request.query, [ 'event' ], query).then (logs => {
				request.server.methods.audit ('access', { id: request.auth.credentials._id, username: request.auth.credentials.username }, 'success', 'log', request.query);
				reply (logs.values).code (200).header ('X-Total-Count', logs.count);
			}).catch (() => {
				request.server.methods.audit ('access', { id: request.auth.credentials._id, username: request.auth.credentials.username }, 'failure', 'log', request.query);
				reply (boom.badImplementation ());
			});
		}
	}
}];
