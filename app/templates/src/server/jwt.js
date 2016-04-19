'use strict';

var mongo = require ('mongodb');

module.exports = {
	/* This is a known false positive with JSLint */
	/* eslint-disable callback-return */
	validate (decoded, request, callback) {
		const users = request.server.plugins ['hapi-mongodb'].db.collection ('users');

		if (request.info.host === decoded.host) {
			/* No need to sanitize input here as the key is signed and validated */
			users.findOne ({
				_id: new mongo.ObjectID (decoded.user),
				active: true
			}).then (user => {
				callback (null, Boolean (user), Object.assign (user, {
					remember: decoded.remember
				}));
			}).catch (() => {
				callback (null, false);
			});
		} else {
			callback (null, false);
		}
	}
	/* eslint-enable callback-return */
};
