(function () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('apidoc', {
		templateUrl: 'app/components/apidoc/apidocView.html',
		controller: function ($scope) {
			angular.extend ($scope, {
				url: 'swagger.json'
			});
		}
	}).config (function ($stateProvider) {
		$stateProvider.state ('apidoc', {
			url: '/apidoc',
			template: '<apidoc></apidoc>'
		});
	});
} ());
