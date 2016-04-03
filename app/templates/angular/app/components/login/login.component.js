(function () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('login', {
		templateUrl: 'app/components/login/login.view.html',
		controller: function ($rootScope, $scope, $state, authFactory) {
			angular.extend ($scope, {
				disable: false,
				login: function (event) {
					event.preventDefault ();
					$scope.disable = true;
					authFactory.authenticate ($scope.username, $scope.password).then (function () {
						$scope.disable = false;
						$scope.authenticationError = false;
						$rootScope.back ();
					}).catch (function () {
						$scope.disable = false;
						$scope.authenticationError = true;
					}); 
				}
			});
		}
	}).config (function ($stateProvider) {
		$stateProvider.state ('login', {
			url: '/login',
			template: '<login></login>',
			data: {
				allowed: function (authFactory) {
					return !authFactory.authenticated;
				}
			}
		});
	});
} ());
