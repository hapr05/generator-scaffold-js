(function logComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('log', {
		templateUrl: 'app/components/log/log.view.html',
		controller: function controller ($scope, $resource, $filter, $uibModal) {
			angular.extend ($scope, {
				logRoute: $resource ('log/'),
				events: [
					'log.option.log',
					'log.option.ops',
					'log.option.request',
					'log.option.response'
				],

				filter: {
					from: moment ().startOf ('day').toDate (),
					to: moment ().endOf ('day').toDate (),
					dates: $filter ('date') (moment ().startOf ('day').toDate (), 'short') + ' - ' + $filter ('date') (moment ().endOf ('day').toDate (), 'short')
				},
				logData: [],
				fromOpen: false,
				toOpen: false,

				view: function view () {
					$scope.logData = $scope.logRoute.query ({
						from: $scope.filter.from,
						to: $scope.filter.to,
						event: $scope.filter.event ? $scope.filter.event.split ('.') [ 2 ] : undefined
					});
				},

				raw: function raw (index) {
					$uibModal.open ({
						size: 'md',
						templateUrl: 'app/components/log/log.raw.html',
						controller: function controller ($scope, raw) {
							$scope.raw = raw;
						},
						resolve: {
							raw: function raw () {
								return $scope.logData [ index ];
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
