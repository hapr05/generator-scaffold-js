(function () {
	'use strict';

	module.exports = {
		manifest: {
			connections: [{
				port: 80
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
