'use strict';

module.exports = {
	admin: {
		_id: 'admin',
		username: 'admin',
		fullName: 'Admin',
		nickname: 'Admin',
		email: 'admin@localhost',
		profile: {
			id: 'admin',
			username: 'admin',
			displayName: 'Admin',
			name: {
				first: 'Admin'
			},
			email: 'admin@localhost'
		},
		scope: [ 'ROLE_ADMIN' ]
	},

	user: {
		_id: 'user',
		username: 'user',
		fullName: 'User',
		nickname: 'User',
		email: 'user@localhost',
		profile: {
			id: 'user',
			username: 'user',
			displayName: 'User',
			name: {
				first: 'User'
			},
			email: 'user@localhost'
		},
		scope: [ 'ROLE_USER' ]
	}
};
