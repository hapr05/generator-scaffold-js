/**
 * Memory Filter
 * @class client.<%= appSlug %>.memoryFilter
 */
(function uptimeFilter () {
	'use strict';

	/**
	 * Converts uptime to a human string
	 * @function client.<%= appSlug %>.uptimeFilter#uptime
	 * @public
	 * @returns {String} the human string uptime representation
	 */
	angular.module ('<%= appSlug %>').filter ('uptime', function filter () {
		return function uptimeDuration (seconds, base) {
			return moment.duration (seconds, base).humanize ();
		};
	});
} ());
