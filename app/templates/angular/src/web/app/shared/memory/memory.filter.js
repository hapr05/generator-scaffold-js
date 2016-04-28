/**
 * Memory Filter
 * @class client.<%= appSlug %>.memoryFilter
 */
(function memoryFilter () {
	'use strict';

	/**
	 * Converts memory to a human string
	 * @function client.<%= appSlug %>.memoryFilter#memory
	 * @public
	 * @returns {String} the human string memory representation
	 */
	angular.module ('<%= appSlug %>').filter ('memory', function filter () {
		return function convertMemory (bytes) {
			var sizes = [ 'B', 'KB', 'MB', 'GB', 'TB' ],
				i = parseInt (Math.floor (Math.log (bytes) / Math.log (1024)), 10);

			return Math.round (bytes / Math.pow (1024, i), 2) + ' ' + sizes [i];
		};
	});
} ());
