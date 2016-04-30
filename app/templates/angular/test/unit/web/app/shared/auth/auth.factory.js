(function authFactoryTests () {
	'use strict';

	describe ('auth factory', function authFactory () {
		var expToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3NhbXBsZXMuYXV0aDAuY29tLyIsInN1YiI6ImZhY2Vib29rfDEwMTU0Mjg3MDI3NTEwMzAyIiwiYXVkIjoiQlVJSlNXOXg2MHNJSEJ3OEtkOUVtQ2JqOGVESUZ4REMiLCJleHAiOjE0MTIyMzQ3MzAsImlhdCI6MTQxMjE5ODczMH0.7M5sAV50fF1-_h9qVbdSgqAnXVF7mz3I6RjS6JiH0H8';

		it ('should indicate unauthenticated', function indicateUnauthenticated () {
			this.authFactory.reset ();
			expect (this.authFactory.authenticated).toBeFalsy ();
		});

		it ('should indicate return null token', function returnNullToken () {
			expect (this.authFactory.token).toBe (null);
		});

		it ('should authenticate', function authenticate () {
			this.authenticate (200);
			expect (this.authFactory.authenticated).toBeTruthy ();
			expect (this.authFactory.token).toBe (this.infiniteToken);
		});

		it ('should reset', function authenticate () {
			this.authenticate (200);
			expect (this.authFactory.authenticated).toBeTruthy ();
			this.authFactory.reset ();
			expect (this.authFactory.authenticated).toBeFalsy ();
		});

		it ('should indicate null token on expred', function indicateNullTokenWhenExpired () {
			this.authenticate (200);
			localStorage.setItem ('<%= appSlug %>.token', expToken);
			expect (this.authFactory.token).toBe (null);
		});

		describe ('refresh', function refresh () {
			it ('should refresh token', function refreshToken () {
				this.$httpBackend.expectGET ('authenticate').respond (200, {}, { Authorization: this.infiniteToken });
				this.authFactory.refresh ();
				this.$httpBackend.flush ();
				expect (this.authFactory.token).toBe (this.infiniteToken);
			});

			it ('should request account on first token refresh', function refreshTokenFirst () {
				this.$httpBackend.expectGET ('authenticate').respond (200, {}, { Authorization: this.infiniteToken });
				this.authFactory.refresh (true);
				this.$httpBackend.flush ();
				this.$httpBackend.expectGET ('account').respond (200, {}, { Authorization: this.infiniteToken });
			});
		});

		it ('should test authrority', function refreshToken () {
			this.authFactory.reset ();
			expect (this.authFactory.hasAnyAuthority ([ 'ROLE_ADMIN' ])).toBeFalsy ();
			this.authenticate (200);
			expect (this.authFactory.hasAnyAuthority ([ 'ROLE_ADMIN' ])).toBeTruthy ();
			expect (this.authFactory.hasAnyAuthority ([ 'ROLE_TEST' ])).toBeFalsy ();
		});

		it ('should reset on refresh failure', function resetOnRefreshFailue () {
			this.refreshResponse = 401;
			this.authFactory.refresh ();
			this.$httpBackend.flush ();
			expect (this.authFactory.token).toBe (null);
		});

		it ('should send forgot', function sendForgot () {
			this.$httpBackend.expectPOST ('authenticate/forgot').respond (200, {}, { Authorization: this.infiniteToken });
			this.authFactory.forgot ('user@localhost');
			this.$httpBackend.flush ();
		});
	});
} ());

