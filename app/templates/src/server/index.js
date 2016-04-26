/**
 * Web server
 * @namespace server
 */
'use strict';

var server;
const glue = require ('glue'),
	config = require ('config'),
	jwt = require ('./jwt'),
	methods = require ('./methods');

module.exports = {
	/**
	 * Starts the server
	 * @function server.start
	 * @returns {Promise} promise that is resolved when the server is started
	 */
	start () {
		return new Promise ((resolve, reject) => {
			glue.compose (config.get ('manifest'), {
				relativeTo: __dirname,
				preRegister (_server_, next) {
					server = _server_;

					methods (server);

					server.register (require ('hapi-auth-jwt2'), () => {
						server.auth.strategy ('jwt', 'jwt', {
							key: config.get ('web.jwtKey'),
							validateFunc: jwt.validate,
							verifyOptions: {
								algorithms: [ 'HS256' ]
							}
						});

						server.auth.default ('jwt');

						next ();
					});<% if (socialLogins.length) { %>

					server.register (require ('bell'), () => {<% for (var i = 0; i < socialLogins.length; i++) { %>
						server.auth.strategy ('<%= socialLogins [i].name %>', 'bell', {
							provider: '<%= socialLogins [i].name %>',
							password: process.env.<%= socialLogins [i].upper %>_PASSWORD,
							clientId: process.env.<%= socialLogins [i].upper %>_CLIENT_ID,
							clientSecret: process.env.<%= socialLogins [i].upper %>_CLIENT_SECRET,
							isSecure: true
						});
<% } %>					});<% } %>
				}
			}).then (_server_ => {
				server = _server_;

				server.start ().then (() => {
					console.log (`Server started on port: ${ server.info.port }`);
					resolve (server);
				}).catch (err => {
					throw err;
				});
			}).catch (err => {
				console.error (err);
				reject (err, server);
			});
		});
	},

	/**
	 * Stops the server
	 * @function server.stop
	 * @public
	 * @returns {Promise} promise that is resolved when the server is stopped
	 */
	stop () {
		return server.stop ();
	},

	/**
	 * Returns the hapi server instance
	 * @function server.instance
	 * @public
	 * @returns {hapi.Server} the hapi server instance
	 */
	instance () {
		return server;
	}
};
