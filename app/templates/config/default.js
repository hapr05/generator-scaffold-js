const package = require ('../package');

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
						version: package.version
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
