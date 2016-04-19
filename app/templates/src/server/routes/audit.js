'use strict';

const boom = require ('boom'),
	auditModel = require ('../models/audit');

module.exports = [{
	method: 'GET',
	path: '/audit/',
	config: {
		auth: {
			strategy: 'jwt',
			scope: [ 'ROLE_ADMIN' ]
		},
		description: 'Search Audit Log Entries',
		notes: 'Searches for audit log entries by date and optionally, event type or username',
		tags: [ 'api', 'log' ],
		validate: {
			query: auditModel.search
		},
		plugins: {
			'hapi-swaggered': {
				responses: {
					200: {
						description: 'Success',
						schema: auditModel.auditEntry
					},
					403: { description: 'Forbidden' },
					500: { description: 'Internal Server Error' }
				}
			}
		},
		handler (request, reply) {
			const audit = request.server.plugins ['hapi-mongodb'].db.collection ('audit');
			var query = {
				$and: [
					{ timestamp: { $gte: request.query.from.getTime () } },
					{ timestamp: { $lte: request.query.to.getTime () } }
				]
			};

			request.server.methods.search (audit, request.query, [ 'event' ], query).then (logs => {
				request.server.methods.audit ('access', { id: request.auth.credentials._id, username: request.auth.credentials.username }, 'success', 'audit', request.query);
				reply (logs.values).code (200).header ('X-Total-Count', logs.count);
			}).catch (() => {
				request.server.methods.audit ('access', { id: request.auth.credentials._id, username: request.auth.credentials.username }, 'failure', 'audit', request.query);
				reply (boom.badImplementation ());
			});
		}
	}
}];
