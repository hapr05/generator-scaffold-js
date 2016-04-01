(function () {
	'use strict';

	const crypto = require ('crypto'),
		jwt = require ('jsonwebtoken'),
		config = require ('config'),
		boom = require ('boom'),
		userModel = require ('../models/user');

	module.exports = [{
		method: 'POST',
		path: '/authenticate',
		config: {
			auth: false,
			description: 'Authenticate a User',
			notes: 'Authenticates a user by username or email and password. The usernamefield can be either the regsitered username or the user\'s email address.  Returns a json web token in the Authorization header on success.  The token must be used as a bearer token in the Authorization header on any authenticated requests.',
			tags: [ 'api', 'authenticate' ], 
			validate: {  
				payload: userModel.authenticate
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
			description: 'Refresh the Authentication Token',
			notes: 'Refresh an unexipred authentication token. Returns a new json web token wth a new expiration date in the Authorization header on success.',
			tags: [ 'api', 'authenticate' ],
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
	}<% for (var i = 0; i < socialLogins.length; i++) { %>, {
		method: 'GET',
		path: '/authenticate/<%= socialLogins [i].name %>',
		config: {
			auth: '<%= socialLogins [i].name %>',
			description: 'Authenticate a User via <%= socialLogins [i].cap %>',
			notes: 'Authenticates a user using OAuth for <%= socialLogins [i].cap %>.  Returns a json web token in the Authorization header on success.  The token must be used as a bearer token in the Authorization header on any authenticated requests.',
			tags: [ 'api', 'authenticate' ],
			handler: (request, reply) => {
				const users = request.server.plugins ['hapi-mongodb' ].db.collection ('users');

				users.findOne ({
					username: request.auth.credentials.profile.username,
					provider: '<%= socialLogins [i].name %>',
					active: true
				}).then ((user) => {
					if (!user) {
						user = {
							username: <% if (-1 !== [ 'facebook', 'google', 'linkedin' ].indexOf (socialLogins [i].name)) { %>request.auth.credentials.profile.id<% } else { %>request.auth.credentials.profile.username<% } %>,
							provider: '<%= socialLogins [i].name %>',
							fullName: request.auth.credentials.profile.displayName,
							nickname: <% if (-1 !== [ 'facebook', 'linkedin' ].indexOf (socialLogins [i].name)) { %>request.auth.credentials.profile.name.first<% } else if ('google' === socialLogins [i].name) { %>request.auth.credentials.profile.name.givenName<% } else { %>request.auth.credentials.profile.displayName.split (" ").shift ()<% } %>,
							email: request.auth.credentials.profile.email,
							lang: <% if ('twitter' === socialLogins [i].name) { %>request.auth.credentials.profile.raw.lang<% } else { %>'en'<% } %>,
							active: true,
							created: new Date (),
							scope: [ 'ROLE_USER' ]
						};
						users._id = users.insertOne (user).insertedId;
					}

					reply.view ('jwt', {
						token: jwt.sign ({
							iss: '<%= appSlug %>',
							exp: parseInt (new Date ().getTime () / 1000, 10) + config.get ('web.tokenExpire'),
							iat: parseInt (new Date ().getTime () / 1000, 10),
							sub: 'auth',
							host: request.info.host,
							user: user._id,
							scope: user.scope
						}, config.get ('web.jwtKey'))
					});
				}).catch (() => {
					reply ().code (401);
				});
			}
		}
	}<% } %>];
} ());
