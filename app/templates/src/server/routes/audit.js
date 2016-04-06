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
			const audit = request.server.plugins [ 'hapi-mongodb' ].db.collection ('audit');
			var query = {
				$and: [
					{ timestamp: { $gte: request.query.from.getTime () }},
					{ timestamp: { $lte: request.query.to.getTime () }}
				]
			};

			if (request.query.event) {
				query.event = request.query.event;
			}

			if (request.query.username) {
				query.user = {
					username: request.query.username
				};
			}

			audit.find (query).sort ({
				$natural: 1
			}).toArray ().then (audit => {
				request.server.methods.audit ('access', { id: request.auth.credentials._id, username: request.auth.credentials.username }, 'success', 'audit', request.query);
				reply (audit).code (200);
			}).catch (() => {
				request.server.methods.audit ('access', { id: request.auth.credentials._id, username: request.auth.credentials.username }, 'failure', 'audit', request.query);
				reply (boom.badImplementation ());
			});
		}
	}
}];
