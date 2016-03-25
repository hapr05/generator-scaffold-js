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
				plugin: {
					register: 'hapi-swaggered',
					options: {
						requiredTags: [ 'authenticate' ],
						endpoint: '/swagger.json',
						tags: {
							authenticate: 'Authentication API'
						},
						info: {
							title: '<%= cfgName %> API Documentation',
							description: '<%= cfgDescription %>',
							/* termsOfService: '', */
							contact: {
								name: '<%= cfgContribName %>',
								email: '<%= cfgContribEmail %>'
							},
							license: {
								name: '<%= cfgLicense %>',
								url: '<%= cfgRepository %>/blob/master/LICENSE.<%= cfgLicense %>'
							},
							version: pkg.version
						},
						responseValidation: true,
						auth: {
							scope: [ 'ROLE_ADMIN' ]
						}
					}
				}
			}, {
				plugin: {
					register: 'hapi-router',
					options: {
						routes: './src/server/routes/**/*.js'
					}
				}
			}, {
				plugin: {
					register: 'crumb',
					options: {
						key: 'crumb',
						size: 43,
						autoGenerate: true,
						addToViewContext: true,
						cookieOptions: {
							/* TODO: Set to secure  when we get https support */
							isSecure: false
						},
						restful: true
					}
				}
			}, {
				plugin: 'vision'
			}, {
				plugin: {
					register: 'visionary',
					options: {
						engines: {
							html: "handlebars"
						},
						relativeTo: __dirname,
						path: '../src/server/views'
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
