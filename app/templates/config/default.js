(function () {
	'use strict';

	const pkg = require ('../package'),
		defer = require ('config/defer').deferConfig;

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
				plugin: 'hapi-auth-jwt2'
			}, {
				plugin: {
					register: 'hapi-mongodb',
					options: {
						url: defer (function (cfg) {
							return cfg.db.url;
						})
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
		db: {
			url: '<%= cfgDbUrl %>'
		},
		web: {
			content: './src/web',
			/* Never share your secret key */
			jwtKey: '<%= jwtKey %>'
		}
	}
} ());
