(function () {
	'use strict';

	const joi = require ('joi'),
		crypto = require ('crypto'),
		jwt = require ('jsonwebtoken'),
		config = require ('config'),
		boom = require ('boom');

	module.exports = [{
		method: 'POST',
		path: '/authenticate',
		config: {
			auth: false,
			description: 'Authenticate a user',
			tags: [ 'authenticate' ],
			validate: {
				payload: joi.object ({
					username: joi.string ().required (),
					password: joi.string ().required ()
				}).required ()
			},
			plugins: {
				'hapi-swaggered': {
					responses: { 
						'200': { 'description': 'Success' },
						'400': { 'description': 'Bad Request' },
						'401': { 'description': 'Unauthorized' }
					}
				}
			},
			handler: (request, reply) => {
				const users = request.server.plugins ['hapi-mongodb' ].db.collection ('users');

				users.findOne ({
					$or: [ { username: request.payload.username }, { email: request.payload.username } ],
					password: crypto.createHash ('sha256').update (request.payload.password).digest ('hex'),
					active: true
				}).then ((user) => {
					if (user) {
						reply ().code (200).header ('Authorization', jwt.sign ({
							iss: '<%= appSlug %>',
							exp: parseInt (new Date ().getTime () / 1000, 10) + config.get ('web.tokenExpire'),
							iat: parseInt (new Date ().getTime () / 1000, 10),
							sub: 'auth',
							host: request.info.host,
							user: user._id,
							scope: user.scope
						}, config.get ('web.jwtKey')));
					} else {
						return Promise.reject ();
					}
				}).catch (() => {
					reply (boom.unauthorized ());
				});
			}
		}
	}, {
		method: 'GET',
		path: '/authenticate',
		config: {
			auth: 'jwt',
			description: 'Refresh the authentication token',
			tags: [ 'authenticate' ],
			validate: {
				params: {}
			},
			plugins: {
				'hapi-swaggered': {
					responses: { 
						'200': { 'description': 'Success' },
						'400': { 'description': 'Bad Request' },
						'401': { 'description': 'Unauthorized' }
					}
				}
			},
			handler: (request, reply) => {
				reply ().code (200).header ('Authorization', jwt.sign ({
					iss: '<%= appSlug %>',
					exp: parseInt (new Date ().getTime () / 1000, 10) + config.get ('web.tokenExpire'),
					iat: parseInt (new Date ().getTime () / 1000, 10),
					sub: 'auth',
					host: request.info.host,
					user: request.auth.credentials._id,
					scope: request.auth.credentials.scope
				}, config.get ('web.jwtKey')));
			}
		}
	}<%- socialRoutes %>];
} ());
