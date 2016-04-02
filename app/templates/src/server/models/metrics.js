(function () {
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
					'1': joi.number ().integer ().required ().description ('1 Minute Load Average'),
					'5': joi.number ().integer ().required ().description ('5 Minute Load Average'),
					'15': joi.number ().integer ().required ().description ('15 Minute Load Average')
				}).required ().description ('Load Averages').meta ({ className: 'OSLoad' }),
				memory: joi.object ({
					free: joi.number ().integer ().required ().description ('Free Memory'),
					total: joi.number ().integer ().required ().description ('Total Memory'),
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
					}).required ().description ('Network Interface Address').meta ({ className: 'NetworkInterfaceAddress' })).required ().description ('Network Interface Addresses'),
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
			}).required ().description ('Process').meta ({ className: 'MetricsProcess' })
		}).description ('Metrics').meta ({ className: 'Metrics' })
	};
} ());
