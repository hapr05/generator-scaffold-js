(function () {
	'use strict';

	window.localeLocation = '';

	beforeEach (module ('<%= appSlug %>'));

	beforeEach (function () {
		inject (function ($rootScope, $state, $compile, $httpBackend, $templateCache) {
			angular.extend (this, {
				$rootScope: $rootScope,
				$state: $state,
				$compile: $compile,
				$httpBackend: $httpBackend,
				$templateCache: $templateCache,
				infiniteToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSIsImFkbWluIjp0cnVlLCJzY29wZSI6WyJST0xFX0FETUlOIiwiUk9MRV9VU0VSIl19.lNob43rYJaJMMrojCrlLtkyNT59ujuagGALTKpar5Gc',

				refreshResponse: 200,
				accountResponse: 200,
				account: {
					id: 'test',
					username: 'test',
					fullName: 'Test User',
					nickname: 'Test',
					email: 'test@localhost'
				}
			});

			this.$httpBackend.whenGET (/assets\/locale\/locale-.*\.json/).respond (200, {});
			this.$httpBackend.whenGET ('authenticate').respond (function respond () {
				return [ this.refreshResponse, {}, { Authorization: this.infiniteToken } ];
			});
			this.$httpBackend.whenGET ('account/').respond (function respond () {
				return [ this.accountResponse, this.account, {} ];
			});
		});
	});

	beforeEach (function () {
		inject (function inject (authFactory) {
			this.authFactory = authFactory;

			this.authenticate = function (code) {
				this.$httpBackend.whenPOST ('authenticate').respond (code, {}, { Authorization: this.infiniteToken });
				this.authFactory.authenticate ('user', 'user');
				this.$httpBackend.flush ();
			};
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

		describe ('redirection', function () {
			it ('should redirect when not authenticated and authentication required', function () {
				this.authFactory.reset ();
				this.$state.go ('audit');
				this.$rootScope.$digest ();
				expect (this.$state.current.name).toBe ('login');
			});

			it ('should redirect when authenticated and authentication not allowed', function () {
				this.authenticate (200);
				this.$state.go ('forgot');
				this.$rootScope.$digest ();
				expect (this.$state.current.name).toBe ('home');
			});

			it ('should redirect when authoridty not allowed', function () {
				spyOn (this.authFactory, 'hasAnyAuthority').and.returnValue (false);
				this.authenticate (200);
				this.$state.go ('audit');
				this.$rootScope.$digest ();
				expect (this.$state.current.name).toBe ('home');
			});
		});
	});
} ());
