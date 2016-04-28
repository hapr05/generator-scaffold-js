/**
 * Server logs
 * @class client.<%= appSlug %>.logComponent
 */
(function logComponent () {
	'use strict';

	var rawController = function rawController ($scope, raw) {
		$scope.raw = raw;
	};

	angular.module ('<%= appSlug %>').component ('log', {
		templateUrl: 'app/components/log/log.view.html',
		controller: function controller ($scope, $resource, $filter, $uibModal) {
			angular.extend ($scope, {
				/**
				 * Current data table page
				 * @member client.<%= appSlug %>.logComponent#page
				 */
				page: 0,
				/**
				 * Number of items to show per page
				 * @member client.<%= appSlug %>.logComponent#limit
				 */
				limit: 10,
				/**
				 * Sort column
				 * @member client.<%= appSlug %>.logComponent#sortBy
				 */
				sortBy: 'timestamp',
				/**
				 * Sort direction
				 * @member client.<%= appSlug %>.logComponent#sortDir
				 */
				sortDir: 'asc',
				/**
				 * Total number of items
				 * @member client.<%= appSlug %>.logComponent#total
				 */
				total: 0,
				/**
				 * Indicates an update failure
				 * @member client.<%= appSlug %>.logComponent#updateFailure
				 */
				updateFailure: false,
				/**
				 * Log resource
				 * @member client.<%= appSlug %>.logComponent#logRoute
				 */
				logRoute: $resource ('log/'),
				/**
				 * Log event types
				 * @member client.<%= appSlug %>.logComponent#events
				 */
				events: [
					'log.option.log',
					'log.option.ops',
					'log.option.request',
					'log.option.response'
				],
				/**
				 * Log data
				 * @member client.<%= appSlug %>.logComponent#logData
				 */
				logData: [],
				/**
				 * Datepicker open flag
				 * @member client.<%= appSlug %>.logComponent#fromOpen
				 */
				fromOpen: false,
				/**
				 * Datepicker open flag
				 * @member client.<%= appSlug %>.logComponent#toOpen
				 */
				toOpen: false,

				/**
				 * Log filter params
				 * @member client.<%= appSlug %>.logComponent#filter
				 */
				filter: {
					from: moment ().startOf ('day').toDate (),
					to: moment ().endOf ('day').toDate (),
					dates: $filter ('date') (moment ().startOf ('day').toDate (), 'short') + ' - ' + $filter ('date') (moment ().endOf ('day').toDate (), 'short')
				},

				/**
				 * Sorts the data table
				 * @function client.<%= appSlug %>.logComponent#sort
				 * @public
				 * @param {String} by - column to sort by
				 */
				sort: function sort (by) {
					if (by === $scope.sortBy) {
						$scope.sortDir = 'asc' === $scope.sortDir ? 'desc' : 'asc';
					} else {
						$scope.sortBy = by;
						$scope.sortDir = 'asc';
					}

					$scope.view ();
				},

				/**
				 * Loads the log data
				 * @function client.<%= appSlug %>.logComponent#view
				 * @public
				 */
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

				/**
				 * Exports the log data
				 * @function client.<%= appSlug %>.logComponent#export
				 * @public
				 */
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

				/**
				 * Displays raw log
				 * @function client.<%= appSlug %>.logComponent#raw
				 * @public
				 * @param {Nubmber} index - index of entry to view
				 */
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
