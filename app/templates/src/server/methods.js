'use strict';

var server;
const audit = (event, user, status, resource, data) => {
	const audit = server.plugins [ 'hapi-mongodb' ].db.collection ('audit');

	/* No need to sanitize here as the data is generated internally */
	audit.insertOne ({
		event,
		timestamp: new Date ().getTime (),
		user,
		status,
		resource,
		data
	});
},
check = str => str.replace (/^\$/, ''),
sanitize = (params, filters) => {
	var c = [ 'sortBy', 'sortDir', 'start', 'limit' ].concat (filters || Reflect.ownKeys (params)),
		ret = true;

	c.forEach (key => {
		if (params [ key ] && params [ key ] !== check (params [ key ])) {
			ret = false;
			return false;
		}
	});

	return ret;
},
filter = (params, filters) => {
	var f = {};

	filters.forEach (key => {
		if (undefined !== params [ key ]) {
			f [ key ] = params [ key ];
		}
	});

	return f;
},
sort = params => {
	if (params.sortBy) {
		let sort = {};

		sort [ params.sortBy ] = 'desc' === params.sortDir ? -1 : 1;
		return sort;
	}
	return false;
},
search = (collection, params, filters, custom) => new Promise ((resolve, reject) => {
	var cursor = collection.find (filter (params, Object.assign (filters, custom))),
		s = sort (params);

	cursor.count ().then (count => {
		if (s) {
			cursor = cursor.sort (s);
		}

		if (params.start) {
			cursor = cursor.skip (params.start);
		}

		if (params.limit) {
			cursor = cursor.limit (params.limit);
		}

		return cursor.toArray ().then (array => {
			resolve ({
				values: array,
				count
			});
		});
	}).catch (err => {
		reject (err);
	});
}),
methods = { audit, check, sanitize, filter, sort, search };

module.exports = _server_ => {
	server = _server_;

	Reflect.ownKeys (methods).forEach (key => {
		server.method (key, methods [ key ], {
			bind: server,
			callback: false
		});
	});
};
