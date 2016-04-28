/**
 * Forgot password
 * @class client.<%= appSlug %>.forgotComponent
 */
(function forgotComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('forgot', {
		templateUrl: 'app/components/forgot/forgot.view.html',
		controller: function controller ($scope, $state, $stateParams, authFactory) {
			angular.extend ($scope, {
				/**
				 * Indicates if forgot password email has been sent
				 * @member client.<%= appSlug %>.forgotComponent#sent
				 */
				sent: false,
				/**
				 * Token from forgot password email
				 * @member client.<%= appSlug %>.forgotComponent#token
				 */
				token: $stateParams.token,

				/**
				 * Sends the forgot password email
				 * @function client.<%= appSlug %>.forgotComponent#reset
				 * @public
				 * @param {Event} event - form submit event
				 */
				reset: function reset (event) {
					event.preventDefault ();
					$scope.sent = true;
					authFactory.forgot ($scope.email, $scope.token, $scope.password).then (function resetSuccessHandler () {
						if ($scope.token) {
							$state.go ('login');
						}
					}).catch (function resetFailureHandler () {
						$scope.resetError = true;
					});
				}
			});
		}
	}).config (function setupState ($stateProvider) {
		$stateProvider.state ('forgot', {
			url: '/forgot/:token',
			template: '<forgot></forgot>',
			data: {
				authenticated: false
			}
		});
	});
} ());
