/**
 * Prompt validators
 * @namespace util.validators
 */
'use strict';

const moment = require ('moment');

module.exports = {
	/**
	 * Validates a project name
	 * @function util.validators.name
	 * @param {String} value - value to validate
	 * @returns {Boolean} true if value is valid
	 */
	name (value) {
		if ('string' !== typeof value || value.length < 1) {
			return 'Name is required.';
		} else if (value.length > 214) {
			return 'Name must be less than or equal to 214 characters.';
		}

		return true;
	},

	/**
	 * Validates a MongoDb url
	 * @function util.validators.dbUrl
	 * @param {String} value - value to validate
	 * @returns {Boolean} true if value is valid
	 */
	dbUrl (value) {
		if ('string' !== typeof value || value.length < 1) {
			return 'Database Connection Url is required.';
		}

		return true;
	},

	/**
	 * Validates a collection name
	 * @function util.validators.collectionName
	 * @param {String} value - value to validate
	 * @returns {Boolean} true if value is valid
	 */
	collectionName (value) {
		if ('string' !== typeof value || value.length < 1) {
			return 'Collection Name is required.';
		} else if (/^[a-zA-Z]+$/.test (value)) {
			return true;
		}

		return 'Collection Name cannot contain non alpha characters.';
	},

	/**
	 * Validates a fieldName
	 * @function util.validators.fieldName
	 * @param {String} value - value to validate
	 * @returns {Boolean} true if value is valid
	 */
	fieldName (value) {
		if (/^[a-zA-Z]*$/.test (value)) {
			return true;
		}

		return 'Field Name cannot contain non alpha characters.';
	},

	/**
	 * Validates a number
	 * @function util.validators.number
	 * @param {String} value - value to validate
	 * @returns {Boolean} true if value is valid
	 */
	number (value) {
		if (value && value !== parseFloat (value).toString ()) {
			return 'Invalid number.';
		}

		return true;
	},

	/**
	 * Validates an integer
	 * @function util.validators.integer
	 * @param {String} value - value to validate
	 * @returns {Boolean} true if value is valid
	 */
	integer (value) {
		if (value && value !== parseInt (value, 10).toString ()) {
			return 'Must be an integer.';
		}

		return true;
	},

	/**
	 * Validates a date
	 * @function util.validators.date
	 * @param {String} value - value to validate
	 * @returns {Boolean} true if value is valid
	 */
	date (value) {
		if (!value || moment (value, [
			'MM-dd-yyyy'
		]).isValid ()) {
			return true;
		}

		return 'Invalid date.';
	}
};
