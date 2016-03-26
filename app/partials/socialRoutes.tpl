<% for (var i = 0; i < social.length; i++) { %>, {
		method: 'GET',
		path: '/authenticate/<%= social [i].name %>',
		config: {
			auth: '<%= social [i].name %>',
			description: 'Authenticate a user via <%= social [i].cap %>',
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
							username: <% if (-1 !== [ 'facebook', 'google', 'linkedin' ].indexOf (social [i].name)) { %>request.auth.credentials.profile.id<% } else { %>request.auth.credentials.profile.username<% } %>,
							provider: '<%= social [i].name %>',
							fullName: request.auth.credentials.profile.displayName,
							nickname: <% if (-1 !== [ 'facebook', 'linkedin' ].indexOf (social [i].name)) { %>request.auth.credentials.profile.name.first<% } else if ('google' === social [i].name) { %>request.auth.credentials.profile.name.givenName<% } else { %>request.auth.credentials.profile.displayName.split (" ").shift ()<% } %>,
							email: request.auth.credentials.profile.email,
							lang: <% if ('twitter' === social [i].name) { %>request.auth.credentials.profile.raw.lang<% } else { %>'en'<% } %>,
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
