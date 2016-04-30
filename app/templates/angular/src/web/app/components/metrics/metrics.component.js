/**
 * System metrics
 * @class client.<%= appSlug %>.metricsComponent
 */
(function metricsComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('metrics', {
		templateUrl: 'app/components/metrics/metrics.view.html',
		controller: function controller ($scope, $resource) {
			angular.extend ($scope, {
				/**
				 * Metrics resource
				 * @member client.<%= appSlug %>.metricsComponent#metricsRoute
				 */
				metricsRoute: $resource ('metrics'),

				/**
				 * Metrics data
				 * @member client.<%= appSlug %>.metricsComponent#metricsData
				 */
				metricsData: {},

				/**
				 * Loads/reloads the system metrics data
				 * @function client.<%= appSlug %>.metricsComponent#refresh
				 * @public
				 */
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
				authenticated: true,
				authority: [ 'ROLE_ADMIN' ]
			}
		});
	});
} ());
