(function authDirectiveTests () {
	'use strict';

	describe ('auth directive', function authDirective () {
		it ('should hide authenticated when unauthenticated', function hideAuthenticatedWhenUnauthenticated () {
			var el = this.$compile (angular.element ('<div <%= appSlug %>-authenticated></div>')) (this.$rootScope);

			this.$rootScope.$digest ();
			expect (el.hasClass ('hidden')).toBeTruthy ();
		});

		it ('should show authenticated when authenticated', function showAuthenticatedWhenAuthenticated () {
			var el = this.$compile (angular.element ('<div <%= appSlug %>-authenticated></div>')) (this.$rootScope);

			this.authenticate (200);
			this.$rootScope.$digest ();
			expect (el.hasClass ('hidden')).toBeFalsy ();
		});

		it ('should show unauthenticated when unauthenticated', function showUnauthenticatedWhenUnauthenticated () {
			var el = this.$compile (angular.element ('<div <%= appSlug %>-unauthenticated></div>')) (this.$rootScope);

			this.authFactory.reset ();
			this.$rootScope.$digest ();
			expect (el.hasClass ('hidden')).toBeFalsy ();
		});

		it ('should hide unauthenticated when authenticated', function hideUnauthenticatedWhenAuthenticated () {
			var el = this.$compile (angular.element ('<div <%= appSlug %>-unauthenticated></div>')) (this.$rootScope);

			this.authenticate (200);
			this.$rootScope.$digest ();
			expect (el.hasClass ('hidden')).toBeTruthy ();
		});

		it ('should hide authority when not authorized', function hideAuthorityWhenNotAuthorized () {
			var el = this.$compile (angular.element ('<div <%= appSlug %>-has-authority="test"></div>')) (this.$rootScope);

			this.authFactory.reset ();
			this.$rootScope.$digest ();
			expect (el.hasClass ('hidden')).toBeTruthy ();
		});

		it ('should show authority when authorized', function showAuthorityWhenAuthorized () {
			var el = this.$compile (angular.element ('<div <%= appSlug %>-has-authority="ROLE_USER"></div>')) (this.$rootScope);

			this.authenticate (200);
			this.$rootScope.$digest ();
			expect (el.hasClass ('hidden')).toBeFalsy ();
		});
	});
} ());
