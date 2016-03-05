(function () {
	'use strict';

	module.exports = {
		manifest: {
			connections: [{
				port: 80
			}]
		},
		web: {
			content: './src/web/dist'
		}
	}
} ());
