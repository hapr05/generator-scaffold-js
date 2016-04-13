(function auditComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('audit', {
		templateUrl: 'app/components/audit/audit.view.html',
		controller: function controller ($scope, $resource, $filter) {
			angular.extend ($scope, {
				page: 0,
				limit: 20,
				sortBy: 'timestamp',
				sortDir: 'asc',
				total: 0,
				updateFailure: false,
				auditRoute: $resource ('audit/'),
				events: [
					'audit.option.auth',
					'audit.option.access',
					'audit.option.change',
					'audit.option.create'
				],
				auditData: [],
				fromOpen: false,
				toOpen: false,

				filter: {
					from: moment ().startOf ('day').toDate (),
					to: moment ().endOf ('day').toDate (),
					dates: $filter ('date') (moment ().startOf ('day').toDate (), 'short') + ' - ' + $filter ('date') (moment ().endOf ('day').toDate (), 'short')
				},

				sort: function sort (by) {
					if (by === $scope.sortBy) {
						$scope.sortDir = 'asc' === $scope.sortDir ? 'desc' : 'asc';
					} else {
						$scope.sortBy = by;
						$scope.sortDir = 'asc';
					}

					$scope.view ();
				},

				view: function view () {
					$scope.auditData = $scope.auditRoute.query ({
						start: $scope.page * $scope.limit,
						limit: $scope.limit,
						sortBy: $scope.sortBy,
						sortDir: $scope.sortDir,
						from: $scope.filter.from,
						to: $scope.filter.to,
						event: $scope.filter.event ? $scope.filter.event.split ('.') [ 2 ] : undefined,
						username: $scope.filter.username || undefined
					}, function getTotal (data, headers) {
						$scope.total = headers ('X-Total-Count');
					});
				},

				export: function view () {
					$scope.auditData = $scope.auditRoute.query ({
						sortBy: $scope.sortBy,
						sortDir: $scope.sortDir,
						from: $scope.filter.from,
						to: $scope.filter.to,
						event: $scope.filter.event ? $scope.filter.event.split ('.') [ 2 ] : undefined,
						username: $scope.filter.username || undefined
					}).$promise.then (function save (data) {
						saveAs (new Blob ([ JSON.stringify (data, null, '\t') ], { type: 'text/plain;charset=utf-8' }), 'audit.json');
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
