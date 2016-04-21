'use strict';

const moment = require ('moment');

module.exports = {
	name (value) {
		if ('string' !== typeof value || value.length < 1) {
			return 'Name is required.';
		} else if (value.length > 214) {
			return 'Name must be less than or equal to 214 characters.';
		}

		return true;
	},

	dbUrl (value) {
		if ('string' !== typeof value || value.length < 1) {
			return 'Database Connection Url is required.';
		}

		return true;
	},

	socialPassword (value) {
		if ('string' !== typeof value || value.length < 1) {
			return 'Password is required.';
		} else if (value.length < 32) {
			return 'Password must be at least 32 characters.';
		}

		return true;
	},

	socialClientId (value) {
		if ('string' !== typeof value || value.length < 1) {
			return 'Client Id is required.';
		}

		return true;
	},

	socialClientSecret (value) {
		if ('string' !== typeof value || value.length < 1) {
			return 'Client Secret is required.';
		}

		return true;
	},

	collectionName (value) {
		if ('string' !== typeof value || value.length < 1) {
			return 'Collection Name is required.';
		} else if (/^[a-zA-Z]+$/.test (value)) {
			return true;
		}

		return 'Collection Name cannot contain non alpha characters.';
	},

	fieldName (value) {
		if (/^[a-zA-Z]*$/.test (value)) {
			return true;
		}

		return 'Field Name cannot contain non alpha characters.';
	},

	number (value) {
		if (value && value !== parseFloat (value).toString ()) {
			return 'Invalid number.';
		}

		return true;
	},

	integer (value) {
		if (value && value !== parseInt (value, 10).toString ()) {
			return 'Must be an integer.';
		}

		return true;
	},

	date (value) {
		if (!value || moment (value, [
			'MM-dd-yyyy'
		]).isValid ()) {
			return true;
		}

		return 'Invalid date.';
	}
};
