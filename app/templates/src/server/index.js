(function (require) {
	'use strict';

	const glue = require ('glue'),
		config = require ('config');

	glue.compose (config.get ('manifest'), {
		relativeTo: __dirname
	}, (err, server) => {
		if (err) {
			console.error (err);
			throw err;
		}   

		server.start (() => {
			console.log ('Server started on port: ' + server.info.port);
		}); 
	});
} (require));
