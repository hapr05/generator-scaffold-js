(function () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('forgot', {
		templateUrl: 'app/components/forgot/forgot.view.html',
		controller: function ($scope, $state, $stateParams, authFactory) {
			angular.extend ($scope, {
				sent: false,
				token: $stateParams.token,
				reset: function (event) {
					event.preventDefault ();
					$scope.sent = true;
					authFactory.forgot ($scope.email, $scope.token, $scope.password).then (function () {
						if ($scope.token) {
							$state.go ('login');
						}
					}).catch (function () {
						$scope.resetError = true;
					});
				}
			});
		}
	}).config (function ($stateProvider) {
		$stateProvider.state ('forgot', {
			url: '/forgot/:token',
			template: '<forgot></forgot>',
			data: {
				allowed: function (authFactory) {
					return !authFactory.authenticated;
				}
			}
		});
	});
} ());
