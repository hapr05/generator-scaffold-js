(function () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('login', {
		templateUrl: 'app/components/login/login.view.html',
		controller: function ($rootScope, $scope, $state, authFactory) {
			angular.extend ($scope, {
				login: function (event) {
					event.preventDefault ();
					authFactory.authenticate ($scope.username, $scope.password).then (function () {
						$scope.authenticationError = false;
						$rootScope.back ();
					}).catch (function () {
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
