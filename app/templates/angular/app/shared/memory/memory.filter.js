(function memoryFilter () {
	'use strict';

	angular.module ('<%= appSlug %>').filter ('memory', function filter () {
		return function convertMemory (bytes) {
			var sizes = [ 'B', 'KB', 'MB', 'GB', 'TB' ],
				i = parseInt (Math.floor (Math.log (bytes) / Math.log (1024)), 10);

			return Math.round (bytes / Math.pow (1024, i), 2) + ' ' + sizes [ i ];
		};
	});
} ());
