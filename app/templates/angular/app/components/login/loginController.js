(function () {
	'use strict';

	angular.module ('<%= appSlug %>').component ('login', {
		templateUrl: 'app/components/login/loginView.html'
	}).config (function ($stateProvider) {
		$stateProvider.state ('login', {
			url: '/login',
			template: '<login></login>'
		});
	});
} ());
