(function (module) {
	'use strict';

	module.exports = {
		name (value) {
			if ("string" !== typeof value || value.length < 1) {
				return 'Name is required.';
			} else if (value.length > 214) {
				return 'Name must be less than or equal to 214 characters.';
			} else {
				return true;
			}
		},

		dbUrl (value) {
			if ("string" !== typeof value || value.length < 1) {
				return 'Database Connection Url is required.';
			} else {
				return true;
			}
		},

		socialPassword (value) {
			if ("string" !== typeof value || value.length < 1) {
				return 'Password is required.';
			} else if (value.length < 32) {
				return 'Password must be at least 32 characters.';
			} else {
				return true;
			}
		},

		socialClientId (value) {
			if ("string" !== typeof value || value.length < 1) {
				return 'Client Id is required.';
			} else {
				return true;
			}
		},

		socialClientSecret (value) {
			if ("string" !== typeof value || value.length < 1) {
				return 'Client Secret is required.';
			} else {
				return true;
			}
		}
	};
} (module));
