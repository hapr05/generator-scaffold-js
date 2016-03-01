(function (angular) {
	'use strict';

	angular.module ('<%= appCamel %>').component ('home', { templateUrl: 'app/components/home/homeView.html'
	}).config (function ($routeProvider) {
		$routeProvider.when ('/', {
			template: '<home></home>'
		});
	});
} (angular));
