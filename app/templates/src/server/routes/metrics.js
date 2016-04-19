'use strict';

const	boom = require ('boom'),
	os = require ('os'),
	metricsModel = require ('../models/metrics');

module.exports = [{
	method: 'GET',
	path: '/metrics',
	config: {
		auth: {
			strategy: 'jwt',
			scope: [ 'ROLE_ADMIN' ]
		},
		description: 'Retrieve System Metrics',
		notes: 'Retrieves the system metrics for the operating system, process, web sever and database.',
		tags: [ 'api', 'metrics' ],
		plugins: {
			'hapi-swaggered': {
				responses: {
					200: {
						description: 'Success',
						schema: metricsModel.metrics
					},
					403: { description: 'Forbidden' },
					500: { description: 'Internal Server Error' }
				}
			}
		},
		handler (request, reply) {
			var networkInterfaces = [],
				osLoad = os.loadavg (),
				osNetworkInterfaces = os.networkInterfaces (),
				admin = request.server.plugins ['hapi-mongodb'].db.admin ();

			Reflect.ownKeys (osNetworkInterfaces).forEach (name => {
				networkInterfaces.push ({
					name,
					addresses: osNetworkInterfaces [name]
				});
			});

			admin.serverStatus ().then (db => {
				request.server.methods.audit ('access', { id: request.auth.credentials._id, username: request.auth.credentials.username }, 'success', 'metrics', {});
				reply ({
					os: {
						arch: os.arch (),
						cpus: os.cpus (),
						memory: {
							free: os.freemem (),
							total: os.totalmem ()
						},
						hostname: os.hostname (),
						load: {
							1: osLoad [0],
							5: osLoad [1],
							15: osLoad [2]
						},
						networkInterfaces,
						platform: os.platform (),
						release: os.release (),
						tempdir: os.tmpdir (),
						uptime: os.uptime ()
					},
					process: {
						env: process.env,
						memory: process.memoryUsage (),
						pid: process.pid,
						uptime: process.uptime (),
						versions: process.versions
					},
					server: {
						connections: request.server.connections.map (connection => connection.info),
						version: request.server.version
					},
					db: {
						version: db.version,
						host: db.host,
						pid: db.pid,
						uptime: db.uptime,
						asserts: db.asserts,
						backgroundFlushing: {
							flushes: db.backgroundFlushing.flushes,
							totalMs: db.backgroundFlushing.total_ms, // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
							averageMs: db.backgroundFlushing.average_ms, // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
							lastMs: db.backgroundFlushing.last_ms, // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
							lastFinished: db.backgroundFlushing.last_finished // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
						},
						connections: db.connections,
						network: db.network,
						document: db.metrics.document,
						ok: db.ok
					}
				});
			}).catch (() => {
				request.server.methods.audit ('access', { id: request.auth.credentials._id, username: request.auth.credentials.username }, 'failure', 'metrics', {});
				reply (boom.badImplementation ());
			});
		}
	}
}];
