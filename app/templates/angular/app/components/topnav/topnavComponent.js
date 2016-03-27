(function () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('topnav', {
		templateUrl: 'app/components/topnav/topnavView.html',
		controller: function ($scope, authFactory) {
			angular.extend ($scope, {
				logout: function () {
					authFactory.reset ();
				}
			});
		}
	});
} ());
