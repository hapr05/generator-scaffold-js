(function credsHelper () {
	'use strict';

	module.exports = {
		admin: {
			username: 'test',
			profile: {
				id: 'test',
				username: 'test',
				displayName: 'test',
				email: 'test',
				name: {
					first: 'test'
				}
			},
			scope: [ 'ROLE_ADMIN' ]
		},

		user: {
			username: 'test',
			profile: {
				id: 'test',
				username: 'test',
				displayName: 'test',
				email: 'test',
				name: {
					first: 'test'
				}
			},
			scope: [ 'ROLE_USER' ]
		}
	};
} ());


