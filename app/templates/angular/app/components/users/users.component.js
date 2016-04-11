(function usersComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('users', {
		templateUrl: 'app/components/users/users.view.html',
		controller: function controller ($scope, accountFactory) {
			angular.extend ($scope, {
				disable: false,
				page: 0,
				limit: 20,
				sortBy: 'username',
				sortDir: 'asc',
				total: 0,
				updateFailure: false,
				updateSuccess: false,
				editIndex: false,
				editUser: false,
				origUser: false,
				userData: [],

				filter: {
				},

				sort: function sort (by) {
					if (by === $scope.sortBy) {
						$scope.sortDir = 'asc' === $scope.sortDir ? 'desc' : 'asc';
					} else {
						$scope.sortBy = by;
						$scope.sortDir = 'asc';
					}

					$scope.search ();
				},

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

				edit: function edit (index) {
					$scope.origEmail = $scope.userData [ index ].email;
					$scope.editIndex = index;
					$scope.editUser = angular.copy ($scope.userData [ index ]);
				},

				update: function update (event) {
					$scope.disable = true;
					delete $scope.editUser.created;
					delete $scope.editUser.modified;
					event.preventDefault ();
					$scope.editUser.$update ().then (function updateSuccessHandler () {
						$scope.disable = false;
						$scope.updateError = false;
						$scope.updateSuccess = true;
						$scope.userData [ $scope.editIndex ] = angular.copy ($scope.editUser);
					}).catch (function updateFailureHandler () {
						$scope.disable = false;
						$scope.updateError = true;
						$scope.updateSuccess = false;
					});
				},

				back: function back () {
					$scope.updateFailure = $scope.updateSuccess = $scope.editIndex = $scope.editUser = $scope.origUser = false;
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
