(function homeComponent () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('home', {
		templateUrl: 'app/components/home/home.view.html'
	}).config (function setupState ($stateProvider) {
		$stateProvider.state ('home', {
			url: '/',
			template: '<home></home>'
		});
	});
} ());
