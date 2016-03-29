(function () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('apidoc', {
		templateUrl: 'app/components/apidoc/apidoc.view.html',
		controller: function ($scope) {
			angular.extend ($scope, {
				url: 'swagger.json'
			});
		}
	}).config (function ($stateProvider) {
		$stateProvider.state ('apidoc', {
			url: '/apidoc',
			template: '<apidoc></apidoc>',
			data: {
				allowed: function (authFactory) {
					return authFactory.hasAuthority ('ROLE_ADMIN');
				}
			}
		});
	});
} ());
