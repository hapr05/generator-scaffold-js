(function () {
	'use strict';

	const joi = require ('joi'),
		crypto = require ('crypto'),
		boom = require ('boom'),
		userModel = require ('../models/user');

	module.exports = [{
		method: 'GET',
		path: '/account/{username}',
		config: {
			auth: {
				strategy: 'jwt',
				mode: 'optional'
			},
			description: 'Retrieve User Account',
			notes: 'Returns an account user by username.  If the user has ROLE_ADMIN or the account being retrieved belongs to the user, full account details are returned.  Otherwise only the status code is returned. The latter case can be used to check if a username is avilable.',
			tags: [ 'api', 'account' ],
			validate: {
				params: userModel.retrieve
			},
			plugins: {
				'hapi-swaggered': {
					responses: { 
						'200': { 'description': 'Success' },
						'404': { 'description': 'Not Found' },
						'500': { 'description': 'Internal Server Error' }
					}
				}
			},
			handler: (request, reply) => {
				const users = request.server.plugins ['hapi-mongodb' ].db.collection ('users');

				users.findOne ({
					username: request.params.username
				}).then ((user) => {
					if (user) {
						//TODO for admin user or user === user, return user data, document response in 200
						reply ().code (200);
					} else {
						reply (boom.notFound ());
					}
				}).catch (() => {
					reply (boom.badImplementation ());
				});
			}
		}
	}, {
		method: 'GET',
		path: '/account/',
		config: {
			auth: {
				strategy: 'jwt',
				mode: 'optional'
			},
			description: 'Search User Accounts',
			notes: 'Searches for user accounts by fields.  If the user has ROLE_ADMIN or the account being retrieved belongs to the user, full account details are returned.  Otherwise only the status code is returned. The latter case can be used to check for duplicates, such as accounts with the same email address.',
			tags: [ 'api', 'account' ],
			validate: {
				query: userModel.search
			},
			plugins: {
				'hapi-swaggered': {
					responses: { 
						'200': { 'description': 'Success' },
						'404': { 'description': 'Not Found' },
						'500': { 'description': 'Internal Server Error' }
					}
				}
			},
			handler: (request, reply) => {
				const users = request.server.plugins ['hapi-mongodb' ].db.collection ('users');

				users.find ({
					email: request.query.email || undefined
				}).toArray ().then ((users) => {
					if (users && users.length) {
						//TODO for admin user or user === user, return user list, document response in 200
						reply ().code (200);
					} else {
						reply (boom.notFound ());
					}
				}).catch (() => {
					reply (boom.badImplementation ());
				});
			}
		}
	}, {
		method: 'POST',
		path: '/account/',
		config: {
			auth: false,
			description: 'Create User Account',
			notes: 'Creates a new user account.',
			tags: [ 'api', 'account' ],
			validate: {
				payload: userModel.create
			},
			plugins: {
				'hapi-swaggered': {
					responses: { 
						'200': { 'description': 'Success' },
						'500': { 'description': 'Internal Server Error' }
					}
				}
			},
			handler: (request, reply) => {
				const users = request.server.plugins ['hapi-mongodb' ].db.collection ('users');

				users.insertOne ({
					username: request.payload.username,
					password: crypto.createHash ('sha256').update (request.payload.password).digest ('hex'),
					fullName: request.payload.fullName,
					nickname: request.payload.nickname,
					email: request.payload.email,
					lang: request.payload.lang || 'en',
					provider: 'internal',
					active: true,
					created: new Date (),
					scope: [ 'ROLE_USER' ]
				}).then (() => {
					reply ().code (200);
				}).catch (() => {
					reply (boom.badImplementation ());
				});
			}
		}
	}];
} ());
