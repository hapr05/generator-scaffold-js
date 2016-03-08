(function () {
	'use strict';

	const glue = require ('glue'),
		config = require ('config');
	var server;

	/*
	function validateJWT (decoded, request, callback) {
		console.error (decoded);
		callback ('Callback First Param', false);
	}
	*/

	module.exports = {
		start () {
			return new Promise ((resolve, reject) => {
				glue.compose (config.get ('manifest'), {
					relativeTo: __dirname
				}).then ((_server_) => {
					server = _server_; 

					/*
					server.auth.strategy ('jwt', 'jwt', {
						key: config.get ('web.jwtKey'),
						validateFunc: validateJWT,
						verifyOptions: {
							algorithms: [ 'HS256' ]
						}
					});

					server.auth.default ('jwt');
					*/

					server.start ().then (() => {
						console.log ('Server started on port: ' + server.info.port);
						resolve (server);
					}).catch ((err) => {
						console.error (err);
						reject (err, server);
					});
				}).catch ((err) => {	 
					console.error (err);
					reject (err, server);
				});
			});
		},

		stop () {
			return server.stop ();
		}
	};
} ());
