(function (require, module) {
	'use strict';

	module.exports = {
		required (value) {
			return Boolean ("string" === typeof value && value.length);
		}
	};
} (require, module));
