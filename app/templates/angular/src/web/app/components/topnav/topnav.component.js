/**
 * Top page navigation
 * @class client.<%= appSlug %>.topNavComponent
 */
(function topNavComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('topnav', {
		templateUrl: 'app/components/topnav/topnav.view.html',
		controller: function controller ($scope, authFactory, $translate) {
			angular.extend ($scope, {
				/**
				 * Available languages
				 * @member client.<%= appSlug %>.topNavComponent#languages
				 */
				languages: {
					en: 'English',
					es: 'Español'

					// scaffold-js-insertsion-point app-languages
				},

				/**
				 * Translation service
				 * @member client.<%= appSlug %>.topNavComponent#$translate
				 */
				$translate: $translate,

				/**
				 * Logs out the current user
				 * @function client.<%= appSlug %>.topNavComponent#logout
				 * @public
				 */
				logout: function logout () {
					authFactory.reset ();
				}
			});
		}
	});
} ());
