(function loginComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('login', {
		templateUrl: 'app/components/login/login.view.html',
		controller: function controller ($rootScope, $scope, $state, authFactory) {
			angular.extend ($scope, {
				disable: false,
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
				allowed: function allowed (authFactory) {
					return !authFactory.authenticated;
				}
			}
		});
	});
} ());
