(function () {
	'use strict';

	const fs = require ('fs');

	module.exports = {
		manifest: {
			connections: [{
				port: 443,
				tls: {
					key: fs.readFileSync ('tls/key.pem'),
					cert: fs.readFileSync ('tls/cert.pem')
				},
				labels: [ 'web' ]
			}]
		},
		db: {
			url: '<%= cfgDbUrl %>'
		},
		web: {
			content: './src/web/dist',
			/* Never share your secret key */
			jwtKey: '<%= jwtKey %>'
		}
	}
} ());
