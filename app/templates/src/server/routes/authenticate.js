(function () {
	'use strict';

	const joi = require ('joi'),
		crypto = require ('crypto'),
		jwt = require ('jsonwebtoken'),
		config = require ('config');

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
							user: user.__id
						}, config.get ('web.jwtKey')));
					} else {
						return Promise.reject ();
					}
				}).catch (() => {
					reply ().code (401);
				});
			}
		}
	}, {
		method: 'GET',
		path: '/authenticate',
		config: {
			description: 'Refresh the authentication token',
			tags: [ 'authenticate' ],
			validate: {
				params: {}
			},
			handler: (request, reply) => {
				reply ().code (200).header ('Authorization', jwt.sign ({
					iss: '<%= appSlug %>',
					exp: parseInt (new Date ().getTime () / 1000, 10) + config.get ('web.tokenExpire'),
					iat: parseInt (new Date ().getTime () / 1000, 10),
					sub: 'auth',
					host: request.info.host,
					user: request.auth.credentials.user
				}, config.get ('web.jwtKey')));
			}
		}
	}];
} ());
