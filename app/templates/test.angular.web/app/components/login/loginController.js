(function () {
	'use strict';

	describe ('login component', function () {
		var infiniteToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSIsImFkbWluIjp0cnVlfQ.eoaDVGTClRdfxUZXiPs3f8FmJDkDE_VCQFXqKxpLsts';

		beforeEach (function () {
			inject (function ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('login', { $scope: this.scope });
			});

			inject (function (authFactory) {
				this.authFactory = authFactory;
			});

			this.$templateCache.put ('app/components/login/loginView.html', '_login_component_content_');
		});

		it ('should load', function () {
			var el = this.$compile ("<login></login>") (this.$rootScope);
			this.$rootScope.$digest ();
			expect (el.html ()).toContain ('_login_component_content_');
		});

		it ('should login', function () {
			this.$httpBackend.expectPOST ('/authenticate').respond (200, {}, { Authorization: infiniteToken }); 
			this.scope.login ({
				preventDefault: function () {}
			});
			this.$httpBackend.flush (); 
		});

		it ('should handle login failure', function () {
			this.$httpBackend.expectPOST ('/authenticate').respond (401);
			this.$httpBackend.whenGET ('/authenticate').respond (401);
			this.scope.login ({
				preventDefault: function () {}
			});
			this.$httpBackend.flush (); 
		});
	});
} ());
