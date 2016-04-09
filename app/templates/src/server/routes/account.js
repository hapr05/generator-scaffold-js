'use strict';

const crypto = require ('crypto'),
	joi = require ('joi'),
	boom = require ('boom'),
	userModel = require ('../models/user'),
	copyKeys = (keys, src) => {
		var copy = {};

		keys.forEach (key => {
			if (undefined !== src [ key ]) {
				copy [ key ] = src [ key ];
			}
		});

		return copy;
	},
	replyUser = (users, query, reply, notFound) => {
		users.findOne (query).then (user => {
			if (user) {
				reply ({
					id: user._id,
					username: user.username,
					fullName: user.fullName,
					nickname: user.nickname,
					email: user.email,
					created: user.created
				}).code (200);
			} else {
				reply (notFound);
			}
		}).catch (() => {
			reply (boom.badImplementation ());
		});
	};

module.exports = [{
	method: 'GET',
	path: '/account/{id}',
	config: {
		description: 'Retrieve User Account',
		notes: 'Returns an account user by id.  If the user has ROLE_ADMIN or the account being retrieved belongs to the user, full account details are returned.',
		tags: [ 'api', 'account' ],
		validate: {
			params: userModel.retrieve
		},
		plugins: {
			'hapi-swaggered': {
				responses: {
					'200': {
						description: 'Success',
						schema: userModel.account
					},
					'400': { description: 'Bad Request' },
					'403': { description: 'Forbidden' },
					'404': { description: 'Not Found' },
					'500': { description: 'Internal Server Error' }
				}
			}
		},
		handler (request, reply) {
			const mongo = request.server.plugins [ 'hapi-mongodb' ],
				users = mongo.db.collection ('users');

			if (request.auth.credentials._id.toString () === request.params.id || -1 !== request.auth.credentials.scope.indexOf ('ROLE_ADMIN')) {
				replyUser (users, { _id: new mongo.ObjectID (request.params.id) }, reply, boom.notFound ());
			} else {
				reply (boom.forbidden ());
			}
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
		notes: `Searches for user accounts by fields.  If the user has ROLE_ADMIN or the account being retrieved belongs to the user, full account details are returned.  Otherwise only the status code is returned.
The latter case can be used to check for duplicates, such as accounts with the same email address.`,
		tags: [ 'api', 'account' ],
		validate: {
			query: userModel.query
		},
		plugins: {
			'hapi-swaggered': {
				responses: {
					'200': {
						description: 'Success',
						schema: joi.array ().items (userModel.account).meta ({ className: 'AccountList' })
					},
					'204': { description: 'No Data' },
					'400': { description: 'Bad Request' },
					'404': { description: 'Not Found' },
					'500': { description: 'Internal Server Error' }
				}
			}
		},
		handler (request, reply) {
			const users = request.server.plugins [ 'hapi-mongodb' ].db.collection ('users');

			users.find (copyKeys ([ 'username', 'email' ], request.query)).toArray ().then (users => {
				if (users && users.length) {
					let resp = [];

					users.forEach (user => {
						if (request.auth.credentials && (request.auth.credentials._id.toString () === user._id || -1 !== request.auth.credentials.scope.indexOf ('ROLE_ADMIN'))) {
							resp.push ({
								id: user._id,
								username: user.username,
								fullName: user.fullName,
								nickname: user.nickname,
								email: user.email,
								created: user.created
							});
						}
					});

					if (resp.length) {
						reply (resp).code (200);
					} else {
						reply ().code (204);
					}
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
					'200': { description: 'Success' },
					'400': { description: 'Bad Request' },
					'500': { description: 'Internal Server Error' }
				}
			}
		},
		handler (request, reply) {
			const users = request.server.plugins [ 'hapi-mongodb' ].db.collection ('users'),
				data = {
					username: request.payload.username,
					fullName: request.payload.fullName,
					nickname: request.payload.nickname,
					email: request.payload.email,
					provider: 'internal'
				};

			users.insertOne ({
				username: request.payload.username,
				password: crypto.createHash ('sha256').update (request.payload.password).digest ('hex'),
				fullName: request.payload.fullName,
				nickname: request.payload.nickname,
				email: request.payload.email,
				provider: 'internal',
				active: true,
				created: new Date (),
				scope: [ 'ROLE_USER' ]
			}).then (res => {
				request.server.methods.audit ('create', { id: res.insertedId, username: request.payload.username }, 'success', 'users', data);
				reply ().code (200);
			}).catch (() => {
				request.server.methods.audit ('create', { id: '', username: request.payload.username }, 'failure', 'users', data);
				reply (boom.badImplementation ());
			});
		}
	}
}, {
	method: 'POST',
	path: '/account/{id}',
	config: {
		description: 'Update User Account',
		notes: 'Updates an existing user account. Only admin user can set active flag and scopes.',
		tags: [ 'api', 'account' ],
		validate: {
			payload: userModel.update
		},
		plugins: {
			'hapi-swaggered': {
				responses: {
					'200': {
						description: 'Success',
						schema: userModel.account
					},
					'400': { description: 'Bad Request' },
					'403': { description: 'Forbidden' },
					'404': { description: 'Not Found' },
					'500': { description: 'Internal Server Error' }
				}
			}
		},
		handler (request, reply) {
			const mongo = request.server.plugins [ 'hapi-mongodb' ],
				users = mongo.db.collection ('users'),
				admin = -1 !== request.auth.credentials.scope.indexOf ('ROLE_ADMIN'),
				keys = [ 'password', 'fullName', 'nickname', 'email' ],
				adminKeys = [ 'password', 'fullName', 'nickname', 'email', 'active', 'scope' ];

			if (request.auth.credentials._id.toString () === request.params.id || admin) {
				var update = copyKeys (admin ? adminKeys : keys, request.payload);

				if (update.password) {
					update.password = crypto.createHash ('sha256').update (update.password).digest ('hex');
				}

				if (Reflect.ownKeys (update).length) {
					users.updateOne ({
						_id: new mongo.ObjectID (request.params.id)
					}, { $set: update }).then (() => {
						delete update.password;
						request.server.methods.audit ('change', { id: request.auth.credentials.id, username: request.auth.credentials.username }, 'success', 'users', update);
						replyUser (users, { _id: new mongo.ObjectID (request.params.id) }, reply, boom.badImplementation ());
					}).catch (() => {
						request.server.methods.audit ('change', { id: request.auth.credentials.id, username: request.auth.credentials.username }, 'failure', 'users', update);
						reply (boom.badImplementation ());
					});
				} else {
					reply (boom.badRequest ());
				}
			} else {
				reply (boom.forbidden ());
			}
		}
	}
}];
