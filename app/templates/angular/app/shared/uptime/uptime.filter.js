(function () {
	'use strict';

	angular.module ('<%= appSlug %>').filter ('uptime', function () {
		return function (seconds, base) {
			return moment.duration (seconds, base).humanize ();
		};  
	});
} ());
