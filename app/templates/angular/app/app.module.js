(function () {
	'use strict';

	angular.module ('<%= appCamel %>', [
		'ngAria',
		'ui.router'
	]).config (function ($urlRouterProvider) {
		$urlRouterProvider.otherwise ('/');
	});
} ());
