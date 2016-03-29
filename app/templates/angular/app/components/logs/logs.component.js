(function () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('logs', {
		templateUrl: 'app/components/logs/logs.view.html',
		controller: function ($scope, $http) {
			angular.extend ($scope, {
				logFiles: [],

				show: function (file) {
					$scope.logData = '';
					$scope.active = file;
					$http.get ('logs/' + file, {
						transformResponse: function (value) {
							return value;
						}
					}).then (function (response) {
						$scope.logData = response.data;
					});
				}
			});

			$http.get ('logs/').then (function (response) {
				$scope.logFiles = response.data;
			});
		}
	}).config (function ($stateProvider) {
		$stateProvider.state ('logs', {
			url: '/logs',
			template: '<logs></logs>',
			data: {
				allowed: function (authFactory) {
					return authFactory.hasAuthority ('ROLE_ADMIN');
				}
			}
		});
	});
} ());
