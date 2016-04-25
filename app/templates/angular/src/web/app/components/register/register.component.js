(function registerComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('register', {
		templateUrl: 'app/components/register/register.view.html',
		controller: function controller ($scope, $state, accountFactory) {
			angular.extend ($scope, {
				disable: false,

				register: function register (event) {
					$scope.disable = true;
					event.preventDefault ();
					accountFactory.create ({
						username: $scope.username,
						password: $scope.password,
						fullName: $scope.fullName,
						nickname: $scope.nickname,
						email: $scope.email
					}).then (function registerSuccessHandler () {
						$scope.disable = false;
						$scope.registrationError = false;
						$state.go ('login');
					}).catch (function regularFailureHandler () {
						$scope.disable = false;
						$scope.registrationError = true;
					});
				}
			});
		}
	}).config (function setupState ($stateProvider) {
		$stateProvider.state ('register', {
			url: '/register',
			template: '<register></register>',
			data: {
				authenticated: false
			}
		});
	});
} ());
