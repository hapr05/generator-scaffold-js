(function (angular) {
	'use strict';

	angular.module ('<%= appCamel %>', [
		'ui.router'
	]).config (function ($urlRouterProvider) {
		$urlRouterProvider.otherwise ('/');
	});
} (angular));
