'use strict';

const joi = require ('joi');

module.exports = {
	metrics: joi.object ({
		os: joi.object ({
			arch: joi.string ().allow ('x64', 'arm', 'ia32').required ().description ('CPU Architecture'),
			cpus: joi.array ().items (joi.object ({
				model: joi.string ().required ().description ('CPM Model'),
				speed: joi.number ().integer ().required ().description ('CPU Clockrate in MegaHertz'),
				times: joi.object ({
					user: joi.number ().integer ().required ().description ('CPU User Time in Milliseconds'),
					nice: joi.number ().integer ().required ().description ('CPU Nice Time in Milliseconds'),
					sys: joi.number ().integer ().required ().description ('CPU System Time in Milliseconds'),
					idle: joi.number ().integer ().required ().description ('CPU Idle Time in Milliseconds'),
					irq: joi.number ().integer ().required ().description ('CPU IRQ Time in Milliseconds')
				}).required ().description ('CPU Times').meta ({ className: 'CPUTimes' })
			}).required ().description ('CPU').meta ({ className: 'CPUS' })).required ().description ('CPUS'),
			hostname: joi.string ().hostname ().required ().description ('Hostname'),
			load: joi.object ({
				1: joi.number ().integer ().required ().description ('1 Minute Load Average'),
				5: joi.number ().integer ().required ().description ('5 Minute Load Average'),
				15: joi.number ().integer ().required ().description ('15 Minute Load Average')
			}).required ().description ('Load Averages').meta ({ className: 'OSLoad' }),
			memory: joi.object ({
				free: joi.number ().integer ().required ().description ('Free Memory'),
				total: joi.number ().integer ().required ().description ('Total Memory')
			}).required ().description ('Memory').meta ({ className: 'MetricsOSMemory' }),
			networkInterfaces: joi.object ({
				name: joi.string ().required ().description ('Network Interaface Name'),
				addresses: joi.array ().items (joi.object ({
					address: joi.string ().ip ().required ().description ('IP Address'),
					netmask: joi.string ().ip ().required ().description ('Netmask'),
					family: joi.string ().allow ('IPv4', 'IPv6').required ().description ('Family'),
					mac: joi.string ().regex (/^([0-9A-Fa-f]{2}:-){5}([0-9A-Fa-f]{2})$/).required ().description ('MAC Address'),
					scopeid: joi.number ().integer ().required ().description ('Scope Id'),
					internal: joi.boolean ().required ().description ('Internal Flag')
				}).required ().description ('Network Interface Address').meta ({ className: 'NetworkInterfaceAddress' })).required ().description ('Network Interface Addresses')
			}).required ().description ('Network Interfaces').meta ({ className: 'NetworkInterfaces' }),
			platform: joi.string ().allow ('darwin', 'freebsd', 'linux', 'sunos', 'win32').required ().description ('Operating System Platform'),
			release: joi.object ().required ().description ('Operating System Release').meta ({ className: 'AnyObject' }),
			tempdir: joi.string ().required ().description ('Temporary Directory'),
			type: joi.string ().required ().description ('Operating System Type'),
			uptime: joi.number ().integer ().required ().description ('Operating System Uptime in Seconds')
		}).required ().description ('Operating System').meta ({ className: 'MetricsOperatingSystem' }),
		process: joi.object ({
			env: joi.object ().required ().description ('Environment Variables').meta ({ className: 'AnyObject' }),
			memory: joi.object ({
				rss: joi.number ().integer ().required ().description ('RSS Memory'),
				heapTotal: joi.number ().integer ().required ().description ('Total Heap Memory'),
				heapUsed: joi.number ().integer ().required ().description ('Used Heap Memory')
			}).required ().description ('Process Memory').meta ({ className: 'ProcessMemory' }),
			pid: joi.number ().integer ().required ().description ('PID'),
			uptime: joi.number ().integer ().required ().description ('Process Uptime in Seconds'),
			versions: joi.object ().required ().description ('Node & Dependencies Versions').meta ({ className: 'AnyObject' })
		}).required ().description ('Process').meta ({ className: 'MetricsProcess' }),
		server: joi.object ({
			connections: joi.array ().items (joi.object ({
				id: joi.string ().required ().description ('Server Connection Id'),
				address: joi.string ().ip ().required ().description ('Server Address'),
				port: joi.number ().integer ().required ().description ('Server Port'),
				protocol: joi.string ().allow ('http', 'https', 'socket').required ().description ('Server Protocol'),
				host: joi.string ().hostname ().required ().description ('Server Host'),
				uri: joi.string ().uri ().required ().description ('Server Uri')
			}).description ('Connection').meta ({ className: 'Connection' })).description ('Connections'),
			version: joi.string ().required ().description ('Hapi Version')
		}).required ().description ('Server').meta ({ className: 'MetricsServer' }),
		db: joi.object ({
			version: joi.string ().required ().description ('Mongo Version'),
			host: joi.string ().hostname ().required ().description ('Database Host'),
			pid: joi.number ().integer ().required ().description ('PID'),
			uptime: joi.number ().integer ().required ().description ('Database Uptime in Seconds'),
			ok: joi.boolean ().required ().description ('Ok'),
			asserts: joi.object ({
				regular: joi.number ().integer ().required ().description ('Regular Asserts'),
				warning: joi.number ().integer ().required ().description ('Warning Asserts'),
				msg: joi.number ().integer ().required ().description ('Msg Asserts'),
				user: joi.number ().integer ().required ().description ('User Asserts'),
				rollovers: joi.number ().integer ().required ().description ('Rollvers Asserts')
			}).required ().description ('Asserts').meta ({ className: 'DatabaseAsserts' }),
			backgroundFlushing: joi.object ({
				flushes: joi.number ().integer ().required ().description ('Flushes'),
				totalMs: joi.number ().integer ().required ().description ('Total Milliseconds'),
				averageMs: joi.number ().required ().description ('Average Milliseconds'),
				lastMs: joi.number ().integer ().required ().description ('Last Milliseconds'),
				lastFinished: joi.date ().iso ().required ().description ('Last Finished')
			}).required ().description ('Background Flushing').meta ({ className: 'BackgroundFlushing' }),
			connections: joi.object ({
				current: joi.number ().integer ().required ().description ('Current'),
				avilable: joi.number ().integer ().required ().description ('Available'),
				totalCreated: joi.number ().integer ().required ().description ('Total Created')
			}).required ().description ('Connections').meta ({ className: 'DatabaseConnections' }),
			network: joi.object ({
				bytesIn: joi.number ().integer ().required ().description ('Bytes In'),
				bytesOut: joi.number ().integer ().required ().description ('Bytes Out'),
				numRequests: joi.number ().integer ().required ().description ('Number of Requests')
			}).required ().description ('Network').meta ({ className: 'DatabaseNetwork' }),
			document: joi.object ({
				deleted: joi.number ().integer ().required ().description ('Deleted'),
				inserted: joi.number ().integer ().required ().description ('Inserted'),
				returned: joi.number ().integer ().required ().description ('Returned'),
				updated: joi.number ().integer ().required ().description ('Updated')
			}).required ().description ('Document').meta ({ className: 'DatabaseDocument' })
		}).required ().description ('Database').meta ({ className: 'MetricsDatabase' })
	}).description ('Metrics').meta ({ className: 'Metrics' })
};
