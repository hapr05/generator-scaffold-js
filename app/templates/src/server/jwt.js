(function () {
	'use strict';

	module.exports = {
		validate (decoded, request, callback) {
			const users = request.server.plugins ['hapi-mongodb' ].db.collection ('users');

			if (request.info.host === decoded.host) {
				users.findOne ({
					__id: decoded.user,
					active: true
				}).then ((user) => {
					callback (null, user ? true : false, user);
					return;
				}).catch (() => {
					callback (null, false);
					return;
				});
			} else {
					callback (null, false);
					return;
			}
		}
	};
} ());
