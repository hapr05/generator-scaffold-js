
						server.register (require ('bell'), () => {<% for (var i = 0; i < social.length; i++) { %>
							server.auth.strategy ('<%= social [i].name %>', 'bell', {
								provider: '<%= social [i].name %>',
								password: '<%= social [i].password %>',
								clientId: '<%= social [i].clientId %>',
								/* Never share your secret key */
								clientSecret: '<%= social [i].clientSecret %>',
								isSecure: false // TODO Terrible idea but required if not using HTTPS especially if developing locally
							});
<% } %>						});
