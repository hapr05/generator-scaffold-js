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
						auth: 'jwt',
						schemes: [ 'https' ],
						responses: { 
							'200': { 'description': 'Success' },
							'400': { 'description': 'Bad Request' },
							'401': { 'description': 'Unauthorized' }
						}  ,
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
					register: 'hapi-router',
					options: {
						routes: './src/server/routes/**/*.js'
					}
				}
			}]
		},
		db: {
			url: '<%= cfgDbUrl %>'
		},
		web: {
			content: './src/web',
			/* Never share your secret key */
			jwtKey: '<%= jwtKey %>',
			tokenExpire: 15 * 60
		}
	}
} ());
