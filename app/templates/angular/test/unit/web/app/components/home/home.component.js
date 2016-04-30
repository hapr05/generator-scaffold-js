(function homeComponentTests () {
	'use strict';

	describe ('home component', function homeComponent () {
		beforeEach (function beforeEach () {
			inject (function inject ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('home', { $scope: this.scope });
			});
		});

		it ('should transition to home state', function transitionToState () {
			this.$state.go ('home');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('home');
		});
	});
} ());
