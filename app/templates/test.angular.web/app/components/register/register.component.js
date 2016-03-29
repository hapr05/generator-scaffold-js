(function () {
	'use strict';

	describe ('register component', function () {
		beforeEach (function () {
			inject (function ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('register', { $scope: this.scope });
			});

			this.$templateCache.put ('app/components/register/register.view.html', '_register_component_content_');
		});

		it ('should transition to register state', function () {
			this.$state.go ('register');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('register');
		});
	
		it ('should load', function () {
			var el = this.$compile ("<register></register>") (this.$rootScope);
			this.$rootScope.$digest ();
			expect (el.html ()).toContain ('_register_component_content_');
		});

		it ('should register', function () {
			this.$httpBackend.expectPOST ('account/').respond (200); 
			this.scope.register ({
				preventDefault: function () {}
			});
			this.$httpBackend.flush (); 
		});

		it ('should handle register failure', function () {
			this.$httpBackend.expectPOST ('account/').respond (500);
			this.scope.register ({
				preventDefault: function () {}
			});
			this.$httpBackend.flush (); 
		});
	});
} ());
