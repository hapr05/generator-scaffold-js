(function uptimeFilter () {
	'use strict';

	angular.module ('<%= appSlug %>').filter ('uptime', function filter () {
		return function uptimeDuration (seconds, base) {
			return moment.duration (seconds, base).humanize ();
		};
	});
} ());
