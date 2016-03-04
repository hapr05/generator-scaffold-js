(function () {
	'use strict';

	exports.register = function (server, options, next) {
		server.route ({
			method: 'GET',
			path: '/{param*}',
			handler: {
				directory: {
					path: './src/web',
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
