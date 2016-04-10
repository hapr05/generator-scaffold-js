(function usersComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('users', {
		templateUrl: 'app/components/users/users.view.html',
		controller: function controller ($scope, accountFactory) {
			angular.extend ($scope, {
				page: 0,
				limit: 20,
				sortBy: 'username',
				sortDir: 'asc',
				total: 0,

				filter: {
				},

				userData: [],

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
