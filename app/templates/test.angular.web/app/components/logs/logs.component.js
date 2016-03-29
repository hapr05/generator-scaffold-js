(function () {
	'use strict';

	describe ('logs component', function () {
		beforeEach (function () {
			inject (function ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('logs', { $scope: this.scope });
			});

			inject (function (authFactory) {
				this.authFactory = authFactory;
			});

			this.$httpBackend.whenGET ('logs/').respond (200, []);
		});
	
		it ('should transition to logs state', function () {
			spyOn (this.authFactory, 'hasAuthority').and.returnValue (true);
			this.$state.go ('logs');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('logs');
		});
	
		it ('should fail to transition to logs if not authorized', function () {
			spyOn (this.authFactory, 'hasAuthority').and.returnValue (false);
			this.$state.go ('logs');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('home');
		});

		it ('should load log', function () {
			this.$httpBackend.expectGET ('logs/file').respond (200);
			this.scope.show ('file');
			this.$httpBackend.flush (); 
		});
	});
} ());
