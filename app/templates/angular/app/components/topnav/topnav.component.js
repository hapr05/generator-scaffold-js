(function topNavComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('topnav', {
		templateUrl: 'app/components/topnav/topnav.view.html',
		controller: function controller ($scope, authFactory) {
			angular.extend ($scope, {
				logout: function logout () {
					authFactory.reset ();
				}
			});
		}
	});
} ());
