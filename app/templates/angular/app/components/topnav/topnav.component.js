(function topNavComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('topnav', {
		templateUrl: 'app/components/topnav/topnav.view.html',
		controller: function controller ($scope, authFactory, $translate) {
			angular.extend ($scope, {
				languages: {
					en: 'English',
					es: 'Español'
				},

				$translate: $translate,

				logout: function logout () {
					authFactory.reset ();
				}
			});
		}
	});
} ());
