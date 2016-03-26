<% for (var i = 0; i < social.length; i++) { %>

		describe ('<%= social [i].name %>', () => {
			it ('should authenticate <%= social [i].name %> user', (done) => {
				sandbox.stub (users, 'findOne', () => {
					return Promise.resolve (null);
				});

				server.views ({
					engines: {
						html: require ('handlebars')
					},
					relativeTo: __dirname,
					path: '../../../../src/server/views'
				});
				_socialAuth (server);
				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'GET', url: '/authenticate/<%= social [i].name %>' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (e) {
						done (e);
					}
				}).catch ((e) => {
					done (e);
				});
			});

			it ('should reauthenticate <%= social [i].name %> user', (done) => {
				server.views ({
					engines: {
						html: require ('handlebars')
					},
					relativeTo: __dirname,
					path: '../../../../src/server/views'
				});
				_socialAuth (server);
				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'GET', url: '/authenticate/<%= social [i].name %>' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (200);
						done ();
					} catch (e) {
						done (e);
					}
				}).catch ((e) => {
					done (e);
				});
			});

			it ('should fail to authenticate <%= social [i].name %> user', (done) => {
				_socialAuth (server, '<%= social [i].name %>');
				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'GET', url: '/authenticate/<%= social [i].name %>' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (401);
						done ();
					} catch (e) {
						done (e);
					}
				}).catch ((e) => {
					done (e);
				});
			});

			it ('should handle view failure', (done) => {
				_socialAuth (server);
				server.route (require ('../../../../src/server/routes/authenticate'));
				server.inject ({ method: 'GET', url: '/authenticate/<%= social [i].name %>' }).then ((response) => {
					try {
						expect (response.statusCode).to.equal (401);
						done ();
					} catch (e) {
						done (e);
					}
				}).catch ((e) => {
					done (e);
				});
			});
		});<% } %>
