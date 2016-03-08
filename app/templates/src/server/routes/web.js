(function () {
	'use strict';

	const config = require ('config');

	exports.register = function (server, options, next) {
		server.route ({
			method: 'GET',
			path: '/{param*}',
			config: {
				auth: false
			},
			handler: {
				directory: {
					path: config.get ('web.content'),
					index: true,
					redirectToSlash: true
				}
			}   
		}); 

		next();
	};

	exports.register.attributes = { 
		name: 'web'
	};
} ());
