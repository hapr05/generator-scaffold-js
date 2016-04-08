(function () {
	'use strict';

	window.localeLocation = '';

	beforeEach (module ('<%= appSlug %>'));

	beforeEach (function () {
		inject (function ($rootScope, $state, $compile, $httpBackend, $templateCache) {
			this.$rootScope = $rootScope;
			this.$state = $state;
			this.$compile = $compile;
			this.$httpBackend = $httpBackend;
			this.$templateCache = $templateCache;

			$httpBackend.whenGET (/assets\/locale\/locale-.*\.json/).respond (200, {});
		});
	});

	beforeEach (function () {
		inject (function (tmhDynamicLocale) {
			spyOn (tmhDynamicLocale, 'set');
		});
	});

	describe ('app.module', function () {
		it ('should default to home state', function () {
			window.location = window.location + '#/invalid_locaiton';
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('home');
		});

		it ('should not set previous state on login', function () {
			this.$rootScope.$broadcast ('$stateChangeSuccess', {}, {
				name: 'login'
			}, {}, {
				name: 'home'
			});
			this.$rootScope.$digest ();
			expect (this.$rootScope.previousStateName).not.toBe ('login');
		});

		it ('should not set previous state on register', function () {
			this.$rootScope.$broadcast ('$stateChangeSuccess', {}, {
				name: 'register'
			}, {}, {
				name: 'home'
			});
			this.$rootScope.$digest ();
			expect (this.$rootScope.previousStateName).not.toBe ('register');
		});

		it ('should manage states', function () {
			this.$rootScope.previousStateName = 'test';
			this.$rootScope.$emit ('$stateChangeSuccess', {}, {
				name: 'home'
			}, {}, {
				name: 'test'
			});
		});

		it ('should handle state back', function () {
			this.$rootScope.previousStateName = 'test';
			this.$rootScope.back ();
			this.$rootScope.previousStateName = 'login';
			this.$rootScope.back ();
		});
	});
} ());
