(function () {
	'use strict';

	const pkg = require ('../package'),
		fs = require ('fs'),
		defer = require ('config/defer').deferConfig,
		reporter = require ('../src/server/reporters/mongo');

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
				port: 8443,
				tls: {
					key: fs.readFileSync ('tls/key.pem'),
					cert: fs.readFileSync ('tls/cert.pem')
				},
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
						endpoint: '/swagger.json',
						tags: {
							authenticate: 'Authentication API',
							account: 'Account API',
							logs: 'Log File API'
						},
						info: {
							title: '<%= cfgName %> API',
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
							isSecure: true 
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
			}, {
				plugin: {
					register: 'good',
					options: {
						reporters: [{
							reporter: reporter,
							events: {
								error: '*',
								log: '*',
								ops: '*',
								request: '*',
								response: '*'
							}
						}]
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
