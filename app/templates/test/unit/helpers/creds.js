(function () {
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
				},
				raw: {
					lang: 'en'
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
				},
				raw: {
					lang: 'en'
				}
			},
			scope: [ 'ROLE_USER' ]
		}
	};
} ());


