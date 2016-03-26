<% for (var i = 0; i < social.length; i++) { %>, {
		method: 'GET',
		path: '/authenticate/<%= social [i].name %>',
		config: {
			auth: '<%= social [i].name %>',
			description: 'Authenticate a vi <%= social [i].cap %>',
			tags: [ 'authenticate' ],
			handler: (request, reply) => {
				const users = request.server.plugins ['hapi-mongodb' ].db.collection ('users');

				users.findOne ({
					username: request.auth.credentials.profile.username,
					provider: '<%= social [i].name %>',
					active: true
				}).then ((user) => {
					if (!user) {
						user = {
							username: request.auth.credentials.profile.username,
							provider: '<%= social [i].name %>',
							fullName: request.auth.credentials.profile.displayName,
							nickname: request.auth.credentials.profile.displayName.split (" ").shift (),
							email: request.auth.credentials.profile.email,
							lang: 'en',
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
	}<% } %>
