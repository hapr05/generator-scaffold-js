(function registerComponentTests () {
	'use strict';

	describe ('register component', function registerComponent () {
		beforeEach (function beforeEach () {
			inject (function inject ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('register', { $scope: this.scope });
			});

			this.$templateCache.put ('app/components/register/register.view.html', '_register_component_content_');
		});

		it ('should transition to register state', function transitionToState () {
			this.authFactory.reset ();
			this.$state.go ('register');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('register');
		});

		it ('should load', function load () {
			var el = this.$compile ('<register></register>') (this.$rootScope);

			this.$rootScope.$digest ();
			expect (el.html ()).toContain ('_register_component_content_');
		});

		it ('should register', function register () {
			this.$httpBackend.expectPOST ('account/').respond (200);
			this.scope.register ({
				preventDefault: function preventDefault () {}
			});
			this.$httpBackend.flush ();
		});

		it ('should handle register failure', function handleRegisterFailure () {
			this.$httpBackend.expectPOST ('account/').respond (500);
			this.scope.register ({
				preventDefault: function preventDefault () {}
			});
			this.$httpBackend.flush ();
		});
	});
} ());
