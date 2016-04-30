/**
 * @namespace server.methods
 */
'use strict';

var server;
/**
 * Logs an audit event
 * @function  server.methods.audit
 * @param {String} event - the audit event (auth, access, change, etc.)
 * @param {Object} user - the user performing audit access
 * @param {String} status - the audit status (succes or failure)
 * @param {String} resource - the resource being accessed
 * @param {Object} data - additional audit data sepcifc to the resource/event
 */
const audit = (event, user, status, resource, data) => {
		const auditCollection = server.plugins ['hapi-mongodb'].db.collection ('audit');

		/* No need to sanitize here as the data is generated internally */
		auditCollection.insertOne ({
			event,
			timestamp: new Date ().getTime (),
			user,
			status,
			resource,
			data
		});
	},
	/**
	 * Clean an input parameter for MongoDb injection
	 * @function  server.methods.clean
	 * @param {String} str - the input string
	 * @returns {String} the clean string
	 */
	clean = str => str.replace (/^\$/, ''),
	/**
	 * Sanitize input params for MongoDb injection
	 * @function  server.methods.sanitize
	 * @param {Object} params - the parameters to sanitize
	 * @param {Object} filters - the allowed filters
	 * @returns {Boolean} true if the paramters are safe, otherwise false
	 */
	sanitize = (params, filters) => {
		var c = [ 'sortBy', 'sortDir', 'start', 'limit' ].concat (filters || Reflect.ownKeys (params)),
			ret = true;

		c.forEach (key => {
			if (params [key] && params [key] !== clean (params [key])) {
				ret = false;
				return false;
			}

			return true;
		});

		return ret;
	},
	/**
	 * Filters input paramters to those allowed in a collection
	 * @function  server.methods.filter
	 * @param {Object} params - the parameters to sanitize
	 * @param {Array} filters - list of acceptable parameters
	 * @returns {Object} filtered parameters
	 */
	filter = (params, filters) => {
		var f = {};

		filters.forEach (key => {
			/* eslint-disable no-undefined */
			if (undefined !== params [key]) {
				f [key] = params [key];
			}
			/* eslint-disable no-undefined */
		});

		return f;
	},
	/**
	 * Converts input parameters to MongoDb sorting instructions
	 * @function  server.methods.sort
	 * @param {Object} params - the parameters to convert
	 * @returns {Object|Boolean} sorting instructions or false if sorting not specified
	 */
	sort = params => {
		if (params.sortBy) {
			const sortParam = {};

			sortParam [params.sortBy] = 'desc' === params.sortDir ? -1 : 1;
			return sortParam;
		}
		return false;
	},
	/**
	 * Performs a sorted and paged search on a collection
	 * @function  server.methods.search
	 * @param {MongoDb.Collection} collection - the collection to search
	 * @param {Object} params - the search parameters
	 * @param {Array} filters - the allowed search parameter keys
	 * @param {Object} custom - custom parameters to include in the search
	 * @returns {Promise} promise that is resolved with the search results and a count of unpaged results
	 */
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
	methods = { audit, clean, sanitize, filter, sort, search };

module.exports = _server_ => {
	server = _server_;

	Reflect.ownKeys (methods).forEach (key => {
		server.method (key, methods [key], {
			bind: server,
			callback: false
		});
	});
};
