(function () {
	'use strict';

	describe ('auth factory', function () {
		var infiniteToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSIsImFkbWluIjp0cnVlfQ.eoaDVGTClRdfxUZXiPs3f8FmJDkDE_VCQFXqKxpLsts',
			expToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3NhbXBsZXMuYXV0aDAuY29tLyIsInN1YiI6ImZhY2Vib29rfDEwMTU0Mjg3MDI3NTEwMzAyIiwiYXVkIjoiQlVJSlNXOXg2MHNJSEJ3OEtkOUVtQ2JqOGVESUZ4REMiLCJleHAiOjE0MTIyMzQ3MzAsImlhdCI6MTQxMjE5ODczMH0.7M5sAV50fF1-_h9qVbdSgqAnXVF7mz3I6RjS6JiH0H8';

		beforeEach (function () {
			inject (function (authFactory) {
				this.authFactory = authFactory;
			});
		});
	
		it ('should indicate unauthenticated', function () {
			this.authFactory.reset ();
			expect (this.authFactory.authenticated).toBeFalsy ();
		});
	
		it ('should indicate return null token', function () {
			expect (this.authFactory.token).toBe (null);
		});
	
		it ('should indicate authenticate', function () {
			this.$httpBackend.expectPOST ('/authenticate').respond (200, {}, { Authorization: infiniteToken });
			this.authFactory.authenticate ('user', 'user');
			this.$httpBackend.flush ();
		});

		it ('should indicate authenticated', function () {
			expect (this.authFactory.authenticated).toBeTruthy ();
		});
	
		it ('should return token', function () {
			expect (this.authFactory.token).toBe (infiniteToken);
		});
	
		it ('should indicate null token on expred', function () {
			localStorage.setItem ('<%= appSlug %>.token', expToken);
			expect (this.authFactory.token).toBe (null);
		});

		it ('should refresh token', function () {
			this.$httpBackend.expectGET ('/authenticate').respond (200, {}, { Authorization: infiniteToken });
			this.authFactory.refresh ();
			this.$httpBackend.flush ();
			expect (this.authFactory.token).toBe (infiniteToken);
		});

		it ('should reset on refresh failure', function () {
			this.$httpBackend.whenGET ('/authenticate').respond (401);
			this.authFactory.refresh ();
			this.$httpBackend.flush ();
			expect (this.authFactory.token).toBe (null);
		});
	});
} ());

