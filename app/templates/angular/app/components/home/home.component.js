(function () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('home', {
		templateUrl: 'app/components/home/home.view.html'
	}).config (function ($stateProvider) {
		$stateProvider.state ('home', {
			url: '/',
			template: '<home></home>'
		});
	});
} ());
