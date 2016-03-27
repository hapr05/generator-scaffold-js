(function () {
	'use strict';

	describe ('apidoc component', function () {
		beforeEach (function () {
			inject (function ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('apidoc', { $scope: this.scope });
			});
		});
	
		it ('should transition to apidoc state', function () {
			this.$state.go ('apidoc');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('apidoc');
		});
	});
} ());
