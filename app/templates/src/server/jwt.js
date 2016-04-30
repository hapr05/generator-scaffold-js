'use strict';

var mongo = require ('mongodb');

module.exports = {
	/**
	 * Validate a JWT authorization token
	 *
	 * If the token is valid callback is called with the user credentials.
	 * If the token is invalid callback is called with false.
	 *
	 * @function server.validate
	 * @param {Object} decoded - the decoded JWT token
	 * @param {hapi.Request} request - the HTTP request
	 * @param {Function} callback - callback function
	 */
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
