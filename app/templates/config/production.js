(function () {
	'use strict';

	module.exports = {
		manifest: {
			connections: [{
				port: 80
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
			content: './src/web/dist'
		},
		mongo: {
			url: '<%= cfgDbUrl %>'
		}
	}
} ());
