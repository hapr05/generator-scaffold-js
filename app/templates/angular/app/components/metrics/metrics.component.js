(function metricsComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('metrics', {
		templateUrl: 'app/components/metrics/metrics.view.html',
		controller: function controller ($scope, $resource) {
			angular.extend ($scope, {
				metricsRoute: $resource ('metrics'),

				metricsData: {},

				refresh: function refresh () {
					$scope.metricsData = $scope.metricsRoute.get ();
				}
			});

			$scope.refresh ();
		}
	}).config (function setupState ($stateProvider) {
		$stateProvider.state ('metrics', {
			url: '/metrics',
			template: '<metrics></metrics>',
			data: {
				allowed: function allowed (authFactory) {
					return authFactory.hasAuthority ('ROLE_ADMIN');
				}
			}
		});
	});
} ());
