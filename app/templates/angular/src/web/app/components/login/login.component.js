/**
 * Login
 * @class client.<%= appSlug %>.loginComponent
 */
(function loginComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('login', {
		templateUrl: 'app/components/login/login.view.html',
		controller: function controller ($rootScope, $scope, $state, authFactory) {
			angular.extend ($scope, {
				/**
				 * Disables the form
				 * @member client.<%= appSlug %>.loginComponent#disable
				 */
				disable: false,

				/**
				 * Performs login
				 * @function client.<%= appSlug %>.loginComponent#login
				 * @public
				 * @param {Event} event - form submit event
				 */
				login: function login (event) {
					event.preventDefault ();
					$scope.disable = true;
					authFactory.authenticate ($scope.username, $scope.password, $scope.rememberMe).then (function loginSuccessHandler () {
						$scope.disable = false;
						$scope.authenticationError = false;
						$rootScope.back ();
					}).catch (function loginFailHandler () {
						$scope.disable = false;
						$scope.authenticationError = true;
					});
				}
			});
		}
	}).config (function setupState ($stateProvider) {
		$stateProvider.state ('login', {
			url: '/login',
			template: '<login></login>',
			data: {
				authenticated: false
			}
		});
	});
} ());
