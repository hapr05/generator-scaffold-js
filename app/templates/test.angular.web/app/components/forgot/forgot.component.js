(function () {
	'use strict';

	describe ('forgot component', function () {
		beforeEach (function () {
			inject (function ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('forgot', { $scope: this.scope });
			});

			this.$templateCache.put ('app/components/forgot/forgot.view.html', '_forgot_component_content_');
		});

		it ('should transition to forgot state', function () {
			this.$state.go ('forgot');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('forgot');
		});

		it ('should load', function () {
			var el = this.$compile ("<forgot></forgot>") (this.$rootScope);
			this.$rootScope.$digest ();
			expect (el.html ()).toContain ('_forgot_component_content_');
		});

		it ('should send request', function () {
			this.$httpBackend.expectPOST ('authenticate/forgot').respond (200);
			this.scope.reset ({
				preventDefault: function () {}
			});
			this.$httpBackend.flush (); 
		});

		it ('should send reset', function () {
			this.$httpBackend.expectPOST ('authenticate/forgot').respond (200);
			this.scope.token = 'test';
			this.scope.reset ({
				preventDefault: function () {}
			});
			this.$httpBackend.flush (); 
		});

		it ('should handle error', function () {
			this.$httpBackend.expectPOST ('authenticate/forgot').respond (401);
			this.scope.token = 'test';
			this.scope.reset ({
				preventDefault: function () {}
			});
			this.$httpBackend.flush (); 
		});
	});
} ());
