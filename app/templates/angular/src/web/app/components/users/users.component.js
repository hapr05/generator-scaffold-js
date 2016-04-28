/**
 * User account management
 * @class client.<%= appSlug %>.usersComponent
 */
(function usersComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('users', {
		templateUrl: 'app/components/users/users.view.html',
		controller: function controller ($scope, accountFactory) {
			angular.extend ($scope, {
				/**
				 * Disables the form
				 * @member client.<%= appSlug %>.usersComponent#disable
				 */
				disable: false,
				/**
				 * Current data table page
				 * @member client.<%= appSlug %>.usersComponent#page
				 */
				page: 0,
				/**
				 * Number of items to show per page
				 * @member client.<%= appSlug %>.usersComponent#limit
				 */
				limit: 20,
				/**
				 * Sort column
				 * @member client.<%= appSlug %>.usersComponent#sortBy
				 */
				sortBy: 'username',
				/**
				 * Sort direction
				 * @member client.<%= appSlug %>.usersComponent#sortDir
				 */
				sortDir: 'asc',
				/**
				 * Total number of items
				 * @member client.<%= appSlug %>.usersComponent#total
				 */
				total: 0,
				/**
				 * Indicates an update failure
				 * @member client.<%= appSlug %>.usersComponent#updateFailure
				 */
				updateFailure: false,
				/**
				 * Indicates an update success
				 * @member client.<%= appSlug %>.usersComponent#updateSuccess
				 */
				updateSuccess: false,
				/**
				 * Current user being edited
				 * @member client.<%= appSlug %>.usersComponent#editIndex
				 */
				editIndex: false,
				/**
				 * Current user being edited
				 * @member client.<%= appSlug %>.usersComponent#editUser
				 */
				editUser: false,
				/**
				 * User data
				 * @member client.<%= appSlug %>.usersComponent#userData
				 */
				userData: [],

				/**
				 * User filter params
				 * @member client.<%= appSlug %>.usersComponent#filter
				 */
				filter: {
				},

				/**
				 * Sorts the data table
				 * @function client.<%= appSlug %>.usersComponent#sort
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

					$scope.search ();
				},

				/**
				 * Searches for a user
				 * @function client.<%= appSlug %>.usersComponent#serch
				 * @public
				 */
				search: function search () {
					$scope.start = 0;

					$scope.userData = accountFactory.query (angular.extend ({
						start: $scope.page * $scope.limit,
						limit: $scope.limit,
						sortBy: $scope.sortBy,
						sortDir: $scope.sortDir
					}, $scope.page, {
						username: $scope.filter.username || undefined,
						email: $scope.filter.email || undefined
					}), function getTotal (data, headers) {
						$scope.total = headers ('X-Total-Count');
					});
				},

				/**
				 * Edits a user
				 * @function client.<%= appSlug %>.usersComponent#edit
				 * @public
				 * @param {Number} index - index of user to edit
				 */
				edit: function edit (index) {
					$scope.origEmail = $scope.userData [index].email;
					$scope.editIndex = index;
					$scope.editUser = angular.copy ($scope.userData [index]);
				},

				/**
				 * Updates user being edited
				 * @function client.<%= appSlug %>.usersComponent#update
				 * @public
				 * @param {Event} event - form submit event
				 */
				update: function update (event) {
					$scope.disable = true;
					delete $scope.editUser.created;
					delete $scope.editUser.modified;
					event.preventDefault ();
					$scope.editUser.$update ().then (function updateSuccessHandler () {
						$scope.disable = false;
						$scope.updateError = false;
						$scope.updateSuccess = true;
						$scope.userData [$scope.editIndex] = angular.copy ($scope.editUser);
					}).catch (function updateFailureHandler () {
						$scope.disable = false;
						$scope.updateError = true;
						$scope.updateSuccess = false;
					});
				},

				/**
				 * Returns to data biew
				 * @function client.<%= appSlug %>.usersComponent#back
				 * @public
				 */
				back: function back () {
					$scope.updateFailure = $scope.updateSuccess = $scope.editIndex = $scope.editUser = false;
				}
			});

			$scope.search ();
		}
	}).config (function config ($stateProvider) {
		$stateProvider.state ('users', {
			url: '/users',
			template: '<users></users>',
			data: {
				authenticated: true,
				authority: [ 'ROLE_ADMIN' ]
			}
		});
	});
} ());
