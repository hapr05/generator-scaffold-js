(function apidocComponentTests () {
	'use strict';

	describe ('apidoc component', function apidocComponent () {
		beforeEach (function beforeEach () {
			inject (function inject ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('apidoc', { $scope: this.scope });
			});
		});

		it ('should transition to apidoc state', function transitionToState () {
			this.authenticate (200);
			spyOn (this.authFactory, 'hasAnyAuthority').and.returnValue (true);
			this.$state.go ('apidoc');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('apidoc');
		});

		it ('should fail to transition to apidoc if not authorized', function failToTransitionToState () {
			this.authFactory.reset ();
			this.$state.go ('apidoc');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('login');
		});
	});
} ());
