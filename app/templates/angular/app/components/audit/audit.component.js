(function auditComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('audit', {
		templateUrl: 'app/components/audit/audit.view.html',
		controller: function controller ($scope, $resource, $filter) {
			angular.extend ($scope, {
				auditRoute: $resource ('audit/'),
				events: [
					'audit.option.auth',
					'audit.option.access',
					'audit.option.change',
					'audit.option.create'
				],

				filter: {
					from: moment ().startOf ('day').toDate (),
					to: moment ().endOf ('day').toDate (),
					dates: $filter ('date') (moment ().startOf ('day').toDate (), 'short') + ' - ' + $filter ('date') (moment ().endOf ('day').toDate (), 'short')
				},
				auditData: [],
				fromOpen: false,
				toOpen: false,

				view: function view () {
					$scope.auditData = $scope.auditRoute.query ({
						from: $scope.filter.from,
						to: $scope.filter.to,
						event: $scope.filter.event ? $scope.filter.event.split ('.') [ 2 ] : undefined,
						username: $scope.filter.username || undefined
					});
				}
			});

			$scope.$watch (function watchVar () {
				return $scope.filter.dates;
			}, function watchAction () {
				if ($scope.filter.from && $scope.filter.to) {
					$scope.filter.dates = $filter ('date') ($scope.filter.from, 'short') + ' - ' + $filter ('date') ($scope.filter.to, 'short');
				} else {
					$scope.filter.dates = '';
				}
			});
		}
	}).config (function setupState ($stateProvider) {
		$stateProvider.state ('audit', {
			url: '/audit',
			template: '<audit></audit>',
			data: {
				authenticated: true,
				authority: [ 'ROLE_ADMIN' ]
			}
		});
	});
} ());
