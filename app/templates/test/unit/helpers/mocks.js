(function () {
	'use strict';

	const mockery = require ('mockery');

	var enabled = false;

	module.exports = {
		enable () {
			if (!enabled) {
				mockery.enable ({
					warnOnReplace: false,
					warnOnUnregistered: false,
					useCleanCache: true
				});

				enabled = true;
			}
		},

		disable () {
			if (enabled) {
				mockery.deregisterAll ();
				mockery.disable ();
				enabled = false;
			}
		},

		mongo (collections) {
			var db = {
				collection (name) {
					return collections [name];
				}
			},
			mongo = {
				MongoClient: {
					connect (url, settings, cb) {
						cb (false, db);
					}
				}
			};

			module.exports.enable ();
			mockery.registerMock ('mongodb', mongo);
			return db;
		},

		server (path, collections) {
			var server = {
				instance () {
					return {
						plugins: {
							'hapi-mongodb': {
								db: {
									collection (name) {
										return collections [name];
									}
								}
							}
						}
					};
				}
			};

			module.exports.enable ();
			mockery.registerMock (path, server);
		}
	};
} ());
