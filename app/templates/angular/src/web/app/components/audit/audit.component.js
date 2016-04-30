/**
 * Audit logs
 * @class client.<%= appSlug %>.auditComponent
 */
(function auditComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('audit', {
		templateUrl: 'app/components/audit/audit.view.html',
		controller: function controller ($scope, $resource, $filter) {
			angular.extend ($scope, {
				/**
				 * Current data table page
				 * @member client.<%= appSlug %>.auditComponent#page
				 */
				page: 0,
				/**
				 * Number of items to show per page
				 * @member client.<%= appSlug %>.auditComponent#limit
				 */
				limit: 20,
				/**
				 * Sort column
				 * @member client.<%= appSlug %>.auditComponent#sortBy
				 */
				sortBy: 'timestamp',
				/**
				 * Sort direction
				 * @member client.<%= appSlug %>.auditComponent#sortDir
				 */
				sortDir: 'asc',
				/**
				 * Total number of items
				 * @member client.<%= appSlug %>.auditComponent#total
				 */
				total: 0,
				/**
				 * Indicates an update failure
				 * @member client.<%= appSlug %>.auditComponent#updateFailure
				 */
				updateFailure: false,
				/**
				 * Audit resource
				 * @member client.<%= appSlug %>.auditComponent#auditRoute
				 */
				auditRoute: $resource ('audit/'),
				/**
				 * Event types
				 * @member client.<%= appSlug %>.auditComponent#events
				 */
				events: [
					'audit.option.auth',
					'audit.option.access',
					'audit.option.change',
					'audit.option.create'
				],
				/**
				 * The audit log data
				 * @member client.<%= appSlug %>.auditComponent#auditData
				 */
				auditData: [],
				/**
				 * Datepicker open flag
				 * @member client.<%= appSlug %>.auditComponent#fromOpen
				 */
				fromOpen: false,
				/**
				 * Datepicker open flag
				 * @member client.<%= appSlug %>.auditComponent#toOpen
				 */
				toOpen: false,

				/**
				 * Log filter params
				 * @member client.<%= appSlug %>.auditComponent#filter
				 */
				filter: {
					from: moment ().startOf ('day').toDate (),
					to: moment ().endOf ('day').toDate (),
					dates: $filter ('date') (moment ().startOf ('day').toDate (), 'short') + ' - ' + $filter ('date') (moment ().endOf ('day').toDate (), 'short')
				},

				/**
				 * Sorts the data table
				 * @function client.<%= appSlug %>.auditComponent#sort
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
				 * Loads the audit log data
				 * @function client.<%= appSlug %>.auditComponent#view
				 * @public
				 */
				view: function view () {
					$scope.auditData = $scope.auditRoute.query ({
						start: $scope.page * $scope.limit,
						limit: $scope.limit,
						sortBy: $scope.sortBy,
						sortDir: $scope.sortDir,
						from: $scope.filter.from,
						to: $scope.filter.to,
						event: $scope.filter.event ? $scope.filter.event.split ('.') [2] : undefined,
						username: $scope.filter.username || undefined
					}, function getTotal (data, headers) {
						$scope.total = headers ('X-Total-Count');
					});
				},

				/**
				 * Exports the audit log data
				 * @function client.<%= appSlug %>.auditComponent#export
				 * @public
				 */
				export: function view () {
					$scope.auditData = $scope.auditRoute.query ({
						sortBy: $scope.sortBy,
						sortDir: $scope.sortDir,
						from: $scope.filter.from,
						to: $scope.filter.to,
						event: $scope.filter.event ? $scope.filter.event.split ('.') [2] : undefined,
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
