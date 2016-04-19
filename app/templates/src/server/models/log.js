'use strict';

const joi = require ('joi');

module.exports = {
	search: joi.object ({
		sortBy: joi.string ().valid ([ 'event', 'timestamp', 'host' ]).optional ().description ('Sort Column'),
		sortDir: joi.string ().valid ([ 'asc', 'desc' ]).optional ().description ('Sort Direction'),
		start: joi.number ().integer ().optional ().description ('Start Record Index'),
		limit: joi.number ().integer ().optional ().description ('Maxmimum Number of Records to Return'),
		from: joi.date ().required ().description ('Start Date/Time for Log Entries'),
		to: joi.date ().required ().description ('End Date/Time for Log Entries'),
		event: joi.string ().valid ('error', 'log', 'ops', 'request', 'response').optional ().description ('Log Event Type')
	}).required ().meta ({ className: 'SearchLogs' }),

	logEntry: joi.array ().items (joi.alternatives ().try (
		joi.object ({
			_id: joi.string ().token ().required ().description ('Identifier'),
			event: joi.string ().allow ('log').required ().description ('Log Event Type'),
			timestamp: joi.date ().timestamp ('javascript').required ().description ('Javascript Timestamp of the Log Entry'),
			tags: joi.array ().items (joi.string ()).required ().description ('Tags'),
			data: joi.object ().required ().description ('Log Entry Metadata').meta ({ className: 'AnyObject' }),
			pid: joi.number ().required ().description ('Process Identifier')
		}).meta ({ className: 'LogLogEntry' }),

		joi.object ({
			_id: joi.string ().token ().required ().description ('Identifier'),
			event: joi.string ().allow ('ops').required ().description ('Log Event Type'),
			timestamp: joi.date ().timestamp ('javascript').required ().description ('Javascript Timestamp of the Log Entry'),
			host: joi.string ().hostname ().required ().description ('Hostname'),
			pid: joi.number ().required ().description ('Process Identifier'),
			os: joi.object ({
				load: joi.array ().items (joi.number ()).required ().description ('Operating System Load Array'),
				mem: joi.object ({
					total: joi.number ().integer ().required ().description ('Total Memory in Bytes'),
					free: joi.number ().integer ().required ().description ('Free Memory in Bytes')
				}).required ().description ('Memory').meta ({ className: 'LogsOSMemory' }),
				uptime: joi.number ().integer ().required ().description ('Uptime in Seconds')
			}).required ().description ('Operating System').meta ({ className: 'LogsOperatingSystem' }),
			proc: joi.object ({
				uptime: joi.number ().integer ().required ().description ('Uptime in Seconds'),
				mem: joi.object ({
					rss: joi.number ().integer ().required ().description ('RSS Memory in Bytes'),
					heapTotal: joi.number ().integer ().required ().description ('Total Heap Memory in Bytes'),
					heapUsed: joi.number ().integer ().required ().description ('Used Heap Memory in Bytes')
				}).required ().description ('Memory').meta ({ className: 'ProcMemory' }),
				delay: joi.number ().required ().description ('Delay in Seconds')
			}).required ().description ('Process').meta ({ className: 'Process' }),
			load: joi.object ({
				requests: joi.object ({
					port: joi.object ({
						total: joi.number ().integer ().required ().description ('Number of Requests'),
						disconnects: joi.number ().integer ().required ().description ('Number of Disconnects'),
						statusCodes: joi.object ({
							port: joi.number ().integer ().required ().description ('Number of Requests for the Status Code (key is status code)')
						}).required ().description ('Number of Requests by Status Code').meta ({ className: 'StatusCode' })
					}).required ().description ('Server Port (key is port number)').meta ({ className: 'RequestServerPort' })
				}).required ().description ('Request Counts').meta ({ className: 'RequestCounts' }),
				concurrents: joi.object ({
					port: joi.number ().integer ().required ().description ('Number of Concurrent Requests for the Port (key is port number)')
				}).required ().description ('Concurrent Requests').meta ({ className: 'Concurrents' }),
				responseTimes: joi.object ({
					port: joi.object ({
						avg: joi.number ().required ().description ('Average Response Time'),
						max: joi.number ().integer ().required ().description ('Max Response Time')
					}).required ().description ('Server Port (key is port number)').meta ({ className: 'ResponseTimesServerPort' })
				}).meta ({ className: 'ResponseTimes' }),
				sockets: joi.object ({
					type: joi.object ({
						total: joi.number ().integer ().required ().description ('Total Active Sockets')
					}).required ().description ('Server Type (key is server type (http/https))').meta ({ className: 'Socket' })
				}).required ().description ('Active Scokets').meta ({ className: 'Sockets' })
			}).required ().description ('Resource Loads').meta ({ className: 'Load' })
		}).meta ({ className: 'OpsLogEntry' }),

		joi.object ({
			_id: joi.string ().token ().required ().description ('Identifier'),
			event: joi.string ().allow ('request').required ().description ('Log Event Type'),
			timestamp: joi.date ().timestamp ('javascript').required ().description ('Javascript Timestamp of the Log Entry'),
			data: joi.object ().required ().description ('Log Entry Metadata').meta ({ className: 'AnyObject' }),
			pid: joi.number ().required ().description ('Process Identifier'),
			id: joi.string ().token ().optional ().description ('Request Identifier'),
			method: joi.string ().allow ('options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect').optional ().description ('HTTP Request Method'),
			path: joi.string ().optional ().description ('Request Path')
		}).meta ({ className: 'RequestLogEntry' }),

		joi.object ({
			_id: joi.string ().token ().required ().description ('Identifier'),
			event: joi.string ().allow ('response').required ().description ('Log Event Type'),
			timestamp: joi.date ().timestamp ('javascript').required ().description ('Javascript Timestamp of the Log Entry'),
			id: joi.string ().token ().optional ().description ('Request Identifier'),
			instance: joi.string ().uri ().required ().description ('Request Instance'),
			labels: joi.array ().items (joi.string ()).optional ().description ('Route Labels'),
			method: joi.string ().allow ('options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect').optional ().description ('HTTP Request Method'),
			path: joi.string ().optional ().description ('Request Path'),
			query: joi.object ({
				param: joi.string ().required (),
				value: joi.string ().required ()
			}).optional ().description ('Query Parameters').meta ({ className: 'QueryParams' }),
			responseTime: joi.number ().integer ().optional ().description ('Response Time'),
			statusCode: joi.number ().integer ().optional ().description ('HTTP Status Code'),
			pid: joi.number ().required ().description ('Process Identifier'),
			httpVersion: joi.number ().allow (0.9, 1.0, 1.1).required ().description ('HTTP Version'),
			source: joi.object ({
				remoteAddress: joi.string ().ip ().required ().description ('Source IP Address'),
				userAgent: joi.string ().required ().description ('Source User Agent'),
				referer: joi.alternatives ().try (
					joi.string ().allow (null)
				).description ('Source Referrer').meta ({ className: 'Source' })
			}).optional ().description ('Request Source').meta ({ className: 'Source' }),
			log: joi.array ().items (joi.object ({
				request: joi.string ().token ().required ().description ('Request Identifier'),
				timestamp: joi.date ().timestamp ('javascript').required ().description ('Javascript Timestamp of the Log Entry'),
				tags: joi.array ().items (joi.string ()).required ().description ('Tags'),
				data: joi.object ().required ().description ('Log Entry Metadata').meta ({ className: 'AnyObject' }),
				internal: joi.boolean ().required ().description ('Internal Flag')
			}).optional ().description ('Request Breakdown').meta ({ className: 'RequestLog' }))
		}).meta ({ className: 'ResponseLogEntry' })
	)).meta ({ className: 'LogEntry' }),

	logEntryBecauseOpenAPISpecDoesntSupportAlternatives: joi.array ().items (joi.object ({
		_id: joi.string ().token ().required ().description ('Identifier'),
		event: joi.string ().allow ('log').required ().description ('Log Event Type'),
		timestamp: joi.date ().timestamp ('javascript').required ().description ('Javascript Timestamp of the Log Entry'),
		tags: joi.array ().items (joi.string ()).optional ().description ('Tags'),
		labels: joi.array ().items (joi.string ()).optional ().description ('Route Labels'),
		id: joi.string ().token ().optional ().description ('Request Identifier'),
		pid: joi.number ().required ().description ('Process Identifier'),
		data: joi.object ().optional ().description ('Log Entry Metadata').meta ({ className: 'AnyObject' }),
		instance: joi.string ().uri ().optional ().description ('Request Instance'),
		host: joi.string ().hostname ().optional ().description ('Hostname'),
		method: joi.string ().allow ('options', 'get', 'head', 'post', 'put', 'delete', 'trace', 'connect').optional ().description ('HTTP Request Method'),
		path: joi.string ().optional ().description ('Request Path'),
		query: joi.object ({
			param: joi.string ().required (),
			value: joi.string ().required ()
		}).optional ().description ('Query Parameters').meta ({ className: 'QueryParams' }),
		responseTime: joi.number ().integer ().optional ().description ('Response Time'),
		statusCode: joi.number ().integer ().optional ().description ('HTTP Status Code'),
		httpVersion: joi.number ().allow (0.9, 1.0, 1.1).optional ().description ('HTTP Version'),
		os: joi.object ({
			load: joi.array ().items (joi.number ()).required ().description ('Operating System Load Array'),
			mem: joi.object ({
				total: joi.number ().integer ().required ().description ('Total Memory in Bytes'),
				free: joi.number ().integer ().required ().description ('Free Memory in Bytes')
			}).required ().description ('Memory').meta ({ className: 'OSMemory' }),
			uptime: joi.number ().integer ().required ().description ('Uptime in Seconds')
		}).optional ().description ('Operating System').meta ({ className: 'OperatingSystem' }),
		proc: joi.object ({
			uptime: joi.number ().integer ().required ().description ('Uptime in Seconds'),
			mem: joi.object ({
				rss: joi.number ().integer ().required ().description ('RSS Memory in Bytes'),
				heapTotal: joi.number ().integer ().required ().description ('Total Heap Memory in Bytes'),
				heapUsed: joi.number ().integer ().required ().description ('Used Heap Memory in Bytes')
			}).required ().description ('Memory').meta ({ className: 'ProcMemory' }),
			delay: joi.number ().required ().description ('Delay in Seconds')
		}).optional ().description ('Process').meta ({ className: 'Process' }),
		load: joi.object ({
			requests: joi.object ({
				port: joi.object ({
					total: joi.number ().integer ().required ().description ('Number of Requests'),
					disconnects: joi.number ().integer ().required ().description ('Number of Disconnects'),
					statusCodes: joi.object ({
						port: joi.number ().integer ().required ().description ('Number of Requests for the Status Code (key is status code)')
					}).required ().description ('Number of Requests by Status Code').meta ({ className: 'StatusCode' })
				}).required ().description ('Server Port (key is port number)').meta ({ className: 'RequestServerPort' })
			}).required ().description ('Request Counts').meta ({ className: 'RequestCounts' }),
			concurrents: joi.object ({
				port: joi.number ().integer ().required ().description ('Number of Concurrent Requests for the Port (key is port number)')
			}).required ().description ('Concurrent Requests').meta ({ className: 'Concurrents' }),
			responseTimes: joi.object ({
				port: joi.object ({
					avg: joi.number ().required ().description ('Average Response Time'),
					max: joi.number ().integer ().required ().description ('Max Response Time')
				}).required ().description ('Server Port (key is port number)').meta ({ className: 'ResponseTimesServerPort' })
			}).meta ({ className: 'ResponseTimes' }),
			sockets: joi.object ({
				type: joi.object ({
					total: joi.number ().integer ().required ().description ('Total Active Sockets')
				}).required ().description ('Server Type (key is server type (http/https))').meta ({ className: 'Socket' })
			}).required ().description ('Active Scokets').meta ({ className: 'Sockets' })
		}).optional ().description ('Resource Loads').meta ({ className: 'Load' }),
		source: joi.object ({
			remoteAddress: joi.string ().ip ().required ().description ('Source IP Address'),
			userAgent: joi.string ().required ().description ('Source User Agent'),
			referer: joi.alternatives ().try (
				joi.string ().allow (null)
			).description ('Source Referrer').meta ({ className: 'Source' })
		}).optional ().description ('Request Source').meta ({ className: 'Source' }),
		log: joi.array ().items (joi.object ({
			request: joi.string ().token ().required ().description ('Request Identifier'),
			timestamp: joi.date ().timestamp ('javascript').required ().description ('Javascript Timestamp of the Log Entry'),
			tags: joi.array ().items (joi.string ()).required ().description ('Tags'),
			data: joi.object ().required ().description ('Log Entry Metadata').meta ({ className: 'AnyObject' }),
			internal: joi.boolean ().required ().description ('Internal Flag')
		}).optional ().description ('Request Breakdown').meta ({ className: 'RequestLog' }))
	}).meta ({ className: 'ResponseLogEntry' }))
};
