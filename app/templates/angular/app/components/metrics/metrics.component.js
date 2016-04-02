(function () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('metrics', {
		templateUrl: 'app/components/metrics/metrics.view.html',
		controller: function ($scope, $resource) {
			angular.extend ($scope, {
				metricsRoute: $resource ('metrics'),

				metricsData: {},

				refresh: function () {
					$scope.metricsData = $scope.metricsRoute.get ();
				}
			});

			$scope.refresh ();
		}
	}).config (function ($stateProvider) {
		$stateProvider.state ('metrics', {
			url: '/metrics',
			template: '<metrics></metrics>',
			data: {
				allowed: function (authFactory) {
					return authFactory.hasAuthority ('ROLE_ADMIN');
				}
			}
		});
	});
} ());
