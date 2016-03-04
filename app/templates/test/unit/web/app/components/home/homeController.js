(function () {
	'use strict';

	describe ('home component', function () {
		beforeEach (function () {
			inject (function ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('home', { $scope: this.scope });
			});
		});
	
		it ('should transition to home state', function () {
			this.$state.go ('home');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('home');
		});
	});
} ());
