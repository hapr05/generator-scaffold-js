/**
 * Account management
 * @class client.<%= appSlug %>.accountComponent
 */
(function accountComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('account', {
		templateUrl: 'app/components/account/account.view.html',
		controller: function controller ($scope, $state, accountFactory) {
			angular.extend ($scope, {
				/**
				 * Disables the form
				 * @member client.<%= appSlug %>.accountComponent#disable
				 */
				disable: false,

				/**
				 * The account factory
				 * @member client.<%= appSlug %>.accountComponent#accountFactory
				 */
				accountFactory: accountFactory,
				/**
				 * The logged in user
				 * @member client.<%= appSlug %>.accountComponent#user
				 */
				user: accountFactory.user,

				/**
				 * Updates the user account
				 * @function client.<%= appSlug %>.accountComponent#update
				 * @public
				 * @param {Event} event - form submit event
				 */
				update: function update (event) {
					$scope.disable = true;
					event.preventDefault ();
					$scope.user.$update ().then (function updateSuccessHandler () {
						$scope.disable = false;
						$scope.updateError = false;
						$scope.updateSuccess = true;
					}).catch (function updateFailureHandler () {
						$scope.disable = false;
						$scope.updateError = true;
						$scope.updateSuccess = false;
					});
				}
			});
		}
	}).config (function setupState ($stateProvider) {
		$stateProvider.state ('account', {
			url: '/account',
			template: '<account></account>',
			data: {
				authenticated: true
			}
		});
	});
} ());
