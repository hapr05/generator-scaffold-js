(function () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('log', {
		templateUrl: 'app/components/log/log.view.html',
		controller: function ($scope, $resource, $filter, $uibModal) {
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

				view: function () {
					$scope.logData = $scope.logRoute.query ({
						from: $scope.filter.from,
						to: $scope.filter.to,
						event: $scope.filter.event ? $scope.filter.event.split ('.') [2] : undefined
					});
				},

				raw: function (index) {
					$uibModal.open ({
						size: 'md',
						templateUrl: 'app/components/log/log.raw.html',
						controller: function ($scope, raw) {
							$scope.raw = raw;
						},
						resolve: {
							raw: function () {
								return $scope.logData [index];
							}
						}
					});
				}
			});

			$scope.$watch (function () {
				return $scope.filter.dates;
			}, function () {
				if ($scope.filter.from && $scope.filter.to) {
					$scope.filter.dates = $filter ('date') ($scope.filter.from, 'short') + ' - ' + $filter ('date') ($scope.filter.to, 'short');
				} else {
					$scope.filter.dates = '';
				}
			});
		}
	}).config (function ($stateProvider) {
		$stateProvider.state ('log', {
			url: '/log',
			template: '<log></log>',
			data: {
				allowed: function (authFactory) {
					return authFactory.hasAuthority ('ROLE_ADMIN');
				}
			}
		});
	});
} ());
