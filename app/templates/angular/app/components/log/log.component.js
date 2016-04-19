(function logComponent () {
	'use strict';

	var rawController = function rawController ($scope, raw) {
		$scope.raw = raw;
	};

	angular.module ('<%= appSlug %>').component ('log', {
		templateUrl: 'app/components/log/log.view.html',
		controller: function controller ($scope, $resource, $filter, $uibModal) {
			angular.extend ($scope, {
				page: 0,
				limit: 10,
				sortBy: 'timestamp',
				sortDir: 'asc',
				total: 0,
				updateFailure: false,
				logRoute: $resource ('log/'),
				events: [
					'log.option.log',
					'log.option.ops',
					'log.option.request',
					'log.option.response'
				],
				logData: [],
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
					$scope.logData = $scope.logRoute.query ({
						start: $scope.page * $scope.limit,
						limit: $scope.limit,
						sortBy: $scope.sortBy,
						sortDir: $scope.sortDir,
						from: $scope.filter.from,
						to: $scope.filter.to,
						event: $scope.filter.event ? $scope.filter.event.split ('.') [2] : undefined
					}, function getTotal (data, headers) {
						$scope.total = headers ('X-Total-Count');
					});
				},

				export: function view () {
					$scope.logRoute.query ({
						sortBy: $scope.sortBy,
						sortDir: $scope.sortDir,
						from: $scope.filter.from,
						to: $scope.filter.to,
						event: $scope.filter.event ? $scope.filter.event.split ('.') [2] : undefined
					}).$promise.then (function save (data) {
						saveAs (new Blob ([ JSON.stringify (data, null, '\t') ], { type: 'text/plain;charset=utf-8' }), 'log.json');
					});
				},

				raw: function raw (index) {
					$uibModal.open ({
						size: 'md',
						templateUrl: 'app/components/log/log.raw.html',
						controller: rawController,
						resolve: {
							raw: function rawResolver () {
								return $scope.logData [index];
							}
						}
					});
				}
			});

			$scope.$watch (function watchVar () {
				return $scope.filter.dates;
			}, function watchHandler () {
				if ($scope.filter.from && $scope.filter.to) {
					$scope.filter.dates = $filter ('date') ($scope.filter.from, 'short') + ' - ' + $filter ('date') ($scope.filter.to, 'short');
				} else {
					$scope.filter.dates = '';
				}
			});
		}
	}).config (function setupState ($stateProvider) {
		$stateProvider.state ('log', {
			url: '/log',
			template: '<log></log>',
			data: {
				authenticated: true,
				authority: [ 'ROLE_ADMIN' ]
			}
		});
	});
} ());
