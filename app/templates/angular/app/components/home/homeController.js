(function (angular) {
	'use strict';

	angular.module ('<%= appCamel %>').component ('home', {
		templateUrl: 'app/components/home/homeView.html'
	}).config (function ($stateProvider) {
		$stateProvider.state ('home', {
			url: '/',
			template: '<home></home>'
		});
	});
} (angular));
