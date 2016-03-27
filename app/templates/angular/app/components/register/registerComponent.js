(function () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('register', {
		templateUrl: 'app/components/register/registerView.html',
		controller: function ($scope, $state, $http, accountFactory) {
			angular.extend ($scope, {
				passwordPattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$/,

				register: function (event) {
					event.preventDefault ();
					accountFactory.create ({
						username: $scope.username,
						password: $scope.password,
						fullName: $scope.fullName,
						nickname: $scope.nickname,
						email: $scope.email
					}).then (function () {
						$scope.registrationError = false;
						$state.go ('login');
					}).catch (function () {
						$scope.registrationError = true;
					}); 
				}
			});
		}
	}).config (function ($stateProvider) {
		$stateProvider.state ('register', {
			url: '/register',
			template: '<register></register>'
		});
	});
} ());
