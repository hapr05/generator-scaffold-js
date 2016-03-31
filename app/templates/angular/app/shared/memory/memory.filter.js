(function () {
	'use strict';

	angular.module ('<%= appSlug %>').filter ('memory', function () {
		return function (bytes) {
			var sizes = ['B', 'KB', 'MB', 'GB', 'TB'], //TODO: translate?
				i = parseInt (Math.floor (Math.log (bytes) / Math.log (1024)));

			return Math.round (bytes / Math.pow (1024, i), 2) + ' ' + sizes [i];
		};  
	});
} ());
