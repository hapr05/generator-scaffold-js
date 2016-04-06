'use strict';

const config = require ('config');

module.exports = [{
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
}];
