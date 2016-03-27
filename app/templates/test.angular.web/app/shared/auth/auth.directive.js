(function () {
	'use strict';

	describe ('auth directive', function () {
		var infiniteToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJST0xFX1RFU1QiXX0.e0iwvoVG8UHUGUcJVYc6jfERlVlSrXk_6UOOaFCnVMM';

		beforeEach (function () {
			inject (function (authFactory) {
				this.authFactory = authFactory;
			});
			this.$httpBackend.whenGET ('/authenticate').respond (401);
		});

		it ('should hide authenticated when unauthenticated', function () {
			var el = this.$compile (angular.element ('<div <%= appSlug %>-authenticated></div>')) (this.$rootScope);
			this.$rootScope.$digest();
			expect (el.hasClass ('hidden')).toBeTruthy ();
		});

		it ('should show authenticated when authenticated', function () {
			var el = this.$compile (angular.element ('<div <%= appSlug %>-authenticated></div>')) (this.$rootScope);
			this.$httpBackend.expectPOST ('/authenticate').respond (200, {}, { Authorization: infiniteToken });
			this.authFactory.authenticate ('user', 'user');
			this.$httpBackend.flush ();
			this.$rootScope.$digest();
			expect (el.hasClass ('hidden')).toBeFalsy ();
		});

		it ('should show unauthenticated when unauthenticated', function () {
			var el = this.$compile (angular.element ('<div <%= appSlug %>-unauthenticated></div>')) (this.$rootScope);
			this.authFactory.reset ();
			this.$rootScope.$digest();
			expect (el.hasClass ('hidden')).toBeFalsy ();
		});

		it ('should hide unauthenticated when authenticated', function () {
			var el = this.$compile (angular.element ('<div <%= appSlug %>-unauthenticated></div>')) (this.$rootScope);
			this.authFactory.reset ();
			this.$httpBackend.expectPOST ('/authenticate').respond (200, {}, { Authorization: infiniteToken });
			this.authFactory.authenticate ('user', 'user');
			this.$httpBackend.flush ();
			this.$rootScope.$digest();
			expect (el.hasClass ('hidden')).toBeTruthy ();
		});

		it ('should hide authority when not authorized', function () {
			var el = this.$compile (angular.element ('<div <%= appSlug %>-has-authority="test"></div>')) (this.$rootScope);
			this.authFactory.reset ();
			this.$httpBackend.expectPOST ('/authenticate').respond (200, {}, { Authorization: infiniteToken });
			this.authFactory.authenticate ('user', 'user');
			this.$httpBackend.flush ();
			this.$rootScope.$digest();
			expect (el.hasClass ('hidden')).toBeTruthy ();
		});

		it ('should show authority when authorized', function () {
			var el = this.$compile (angular.element ('<div <%= appSlug %>-has-authority="ROLE_TEST"></div>')) (this.$rootScope);
			this.authFactory.reset ();
			this.$httpBackend.expectPOST ('/authenticate').respond (200, {}, { Authorization: infiniteToken });
			this.authFactory.authenticate ('user', 'user');
			this.$httpBackend.flush ();
			this.$rootScope.$digest();
			expect (el.hasClass ('hidden')).toBeFalsy ();
		});
	});
} ());
