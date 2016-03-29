(function () {
	'use strict';

	describe ('apidoc component', function () {
		beforeEach (function () {
			inject (function ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('apidoc', { $scope: this.scope });
			});

			inject (function (authFactory) {
				this.authFactory = authFactory;
			});
		});
	
		it ('should transition to apidoc state', function () {
			spyOn (this.authFactory, 'hasAuthority').and.returnValue (true);
			this.$state.go ('apidoc');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('apidoc');
		});
	
		it ('should fail to transition to apidoc if not authorized', function () {
			spyOn (this.authFactory, 'hasAuthority').and.returnValue (false);
			this.$state.go ('apidoc');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('home');
		});
	});
} ());
