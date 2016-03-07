(function () {
	'use strict';

	const pkg = require ('../package');

	module.exports = {
		manifest: {
			server: {
				debug: {
					request: [ 'error' ]
				},
				connections: {
					routes: {
						security: true
					}
				}
			},
			connections: [{
				port: 8080,
				labels: [ 'web' ]
			}],
			registrations: [{
				plugin: {
					register: 'hapi-mongodb',
					options: {
						url: '<%= cfgDbUrl %>'
					}
				}
			}, {
				plugin: 'inert'
			}, {
				plugin: 'vision'
			}, {
				plugin: {
					register: 'hapi-swagger',
					options: {
						info: {
							title: '<%= cfgName %> API Documentation',
							description: '<%= cfgDescription %>',
							/* termsOfService: '', */
							contact: {
								name: '<%= cfgContribName %>',
								email: '<%= cfgContribEmail %>'
							},
							license: {
								name: '<%= cfgLicense %>'
								/* url: '' */
							},
							version: pkg.version
						},
						documentationPath: '/swagger'
					}
				}
			}, {
				plugin: {
					register: './routes/api'
				},
				options: {
					routes: {
						prefix: '/api'
					}
				}
			}, {
				plugin: {
					register: './routes/web'
				}
			}]
		},
		web: {
			content: './src/web'
		}
	}
} ());
