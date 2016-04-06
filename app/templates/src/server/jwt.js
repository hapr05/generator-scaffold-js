'use strict';

var mongo = require ('mongodb');

module.exports = {
	validate (decoded, request, callback) {
		const users = request.server.plugins [ 'hapi-mongodb' ].db.collection ('users');

		if (request.info.host === decoded.host) {
			users.findOne ({
				_id: new mongo.ObjectID (decoded.user),
				active: true
			}).then (user => {
				callback (null, user ? true : false, user);
			}).catch (() => {
				callback (null, false);
			});
		} else {
			callback (null, false);
		}
	}
};
