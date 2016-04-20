(function accountComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('account', {
		templateUrl: 'app/components/account/account.view.html',
		controller: function controller ($scope, $state, accountFactory) {
			angular.extend ($scope, {
				disable: false,

				accountFactory: accountFactory,
				user: accountFactory.user,

				update: function update (event) {
					$scope.disable = true;
					event.preventDefault ();
					$scope.user.$update ().then (function updateSuccessHandler () {
						$scope.disable = false;
						$scope.updateError = false;
						$scope.updateSuccess = true;
					}).catch (function updateFailureHandler () {
						$scope.disable = false;
						$scope.updateError = true;
						$scope.updateSuccess = false;
					});
				}
			});
		}
	}).config (function setupState ($stateProvider) {
		$stateProvider.state ('account', {
			url: '/account',
			template: '<account></account>',
			data: {
				authenticated: true
			}
		});
	});
} ());
