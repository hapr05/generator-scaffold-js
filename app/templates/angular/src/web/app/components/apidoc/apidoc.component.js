/**
 * API documentation
 * @class client.<%= appSlug %>.accountComponent
 */
(function apidocComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('apidoc', {
		templateUrl: 'app/components/apidoc/apidoc.view.html',
		controller: function controller ($scope) {
			angular.extend ($scope, {
				/**
				 * Swagger url
				 * @member client.<%= appSlug %>.apidocComponent#url
				 */
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
