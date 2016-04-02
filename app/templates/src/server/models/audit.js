(function () {
	'use strict';

	const joi = require ('joi');

	module.exports = {
		search: joi.object ({
			from: joi.date ().required ().description ('Start Date/Time for Log Entries'),
			to: joi.date ().required ().description ('End Date/Time for Log Entries'),
			username: joi.string ().optional ().description ('Username'),
			event: joi.string ().valid ('auth', 'access', 'change', 'create').optional ().description ('Log Event Type')
		}).required ().meta ({ className: 'SearchAuditLogs' }),

		auditEntry: joi.array ().items (
			joi.object ({
				'_id': joi.string ().token ().required ().description ('Identifier'),
				event: joi.string ().allow ('auth', 'access', 'change', 'create').required ().description ('Log Event Type'),
				timestamp: joi.date ().timestamp ('javascript').required ().description ('Javascript Timestamp of the Log Entry'),
				userid: joi.object ({
					id: joi.string ().required ().description ('User Id'),
					username: joi.string ().required ().description ('Username')
				}).required ().description ('User').meta ({ className: 'User' }),
				status: joi.string ().valid ('success', 'failure').required ().description ('Event Status'),
				resource: joi.string ().required ().description ('Resource Accesed'),
				data: joi.object ().required ().description ('Log Entry Metadata').meta ({ className: 'AnyObject' })
			}).meta ({ className: 'LogLogEntry' })
		).meta ({ className: 'AuditLogEntry' })
	};
} ());
