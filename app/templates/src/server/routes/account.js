(function () {
	'use strict';

	const joi = require ('joi'),
		crypto = require ('crypto'),
		boom = require ('boom');

	module.exports = [{
		method: 'GET',
		path: '/account/{username}',
		config: {
			auth: {
				strategy: 'jwt',
				mode: 'optional'
			},
			description: 'Retrieve user account',
			tags: [ 'api', 'account' ],
			validate: {
				params: joi.object ({
					username: joi.string ().required ()
				}).required ()
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
			description: 'Retrieve user account list',
			tags: [ 'api', 'account' ],
			validate: {
				query: joi.object ({
					email: joi.string ().email ().optional ()
				}).optional ()
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
					email: request.query.email
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
			description: 'Create user account',
			tags: [ 'api', 'account' ],
			validate: {
				payload: joi.object ({
					username: joi.string ().required (),
					password: joi.string ().regex (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$/, 'strong').min (8).required (),
					fullName: joi.string ().required (),
					nickname: joi.string ().required (),
					email: joi.string ().email ().required (),
					lang: joi.string ().optional ()
				}).required ()
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
