(function apidocComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('apidoc', {
		templateUrl: 'app/components/apidoc/apidoc.view.html',
		controller: function controller ($scope) {
			angular.extend ($scope, {
				url: 'swagger.json'
			});
		}
	}).config (function config ($stateProvider) {
		$stateProvider.state ('apidoc', {
			url: '/apidoc',
			template: '<apidoc></apidoc>',
			data: {
				authenticated: true,
				authority: [ 'ROLE_ADMIN' ]
			}
		});
	});
} ());
