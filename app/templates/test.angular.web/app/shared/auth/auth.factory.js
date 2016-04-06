(function authFactoryTests () {
	'use strict';

	describe ('auth factory', function authFactory () {
		var infiniteToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSIsImFkbWluIjp0cnVlfQ.eoaDVGTClRdfxUZXiPs3f8FmJDkDE_VCQFXqKxpLsts',
			expToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3NhbXBsZXMuYXV0aDAuY29tLyIsInN1YiI6ImZhY2Vib29rfDEwMTU0Mjg3MDI3NTEwMzAyIiwiYXVkIjoiQlVJSlNXOXg2MHNJSEJ3OEtkOUVtQ2JqOGVESUZ4REMiLCJleHAiOjE0MTIyMzQ3MzAsImlhdCI6MTQxMjE5ODczMH0.7M5sAV50fF1-_h9qVbdSgqAnXVF7mz3I6RjS6JiH0H8';

		beforeEach (function beforeEach () {
			inject (function inject (authFactory) {
				this.authFactory = authFactory;
			});
		});

		it ('should indicate unauthenticated', function indicateUnauthenticated () {
			this.authFactory.reset ();
			expect (this.authFactory.authenticated).toBeFalsy ();
		});

		it ('should indicate return null token', function returnNullToken () {
			expect (this.authFactory.token).toBe (null);
		});

		it ('should authenticate', function authenticate () {
			this.$httpBackend.expectPOST ('authenticate').respond (200, {}, { Authorization: infiniteToken });
			this.authFactory.authenticate ('user', 'user');
			this.$httpBackend.flush ();
			expect (this.authFactory.authenticated).toBeTruthy ();
			expect (this.authFactory.token).toBe (infiniteToken);
		});

		it ('should indicate null token on expred', function indicateNullTokenWhenExpired () {
			localStorage.setItem ('<%= appSlug %>.token', expToken);
			expect (this.authFactory.token).toBe (null);
		});

		it ('should refresh token', function refreshToken () {
			this.$httpBackend.expectGET ('authenticate').respond (200, {}, { Authorization: infiniteToken });
			this.authFactory.refresh ();
			this.$httpBackend.flush ();
			expect (this.authFactory.token).toBe (infiniteToken);
		});

		it ('should reset on refresh failure', function resetOnRefreshFailue () {
			this.$httpBackend.whenGET ('authenticate').respond (401);
			this.authFactory.refresh ();
			this.$httpBackend.flush ();
			expect (this.authFactory.token).toBe (null);
		});

		it ('should send forgot', function sendForgot () {
			this.$httpBackend.expectPOST ('authenticate/forgot').respond (200, {}, { Authorization: infiniteToken });
			this.authFactory.forgot ('user@localhost');
			this.$httpBackend.flush ();
		});
	});
} ());

