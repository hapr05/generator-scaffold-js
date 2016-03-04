(function () {
	'use strict';

	const glue = require ('glue'),
		config = require ('config');
	var server;

	module.exports = {
		start () {
			return new Promise ((resolve, reject) => {
				glue.compose (config.get ('manifest'), {
					relativeTo: __dirname
				}).then ((_server_) => {
					server = _server_; 
					server.start ().then (() => {
						console.log ('Server started on port: ' + server.info.port);
						resolve (server);
					}, (err) => {
						console.error (err);
						reject (err, server);
					});
				}, (err) => {	 
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
