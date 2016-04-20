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
			jwtKey: process.env.JWT_KEY,
			tokenExpire: 15 * 60,
			tokenRememberExpire: 90 * 24 * 60 * 60,
			tokenForgotExpire: 24 * 60 * 60,
			tokenValidateExpire: 24 * 60 * 60
		}
	}
} ());
