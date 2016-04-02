(function () {
	'use strict';

	describe ('metrics component', function () {
		beforeEach (function () {
			inject (function ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('metrics', { $scope: this.scope });
			});

			inject (function (authFactory) {
				this.authFactory = authFactory;
			});

			this.$templateCache.put ('app/components/metrics/metrics.view.html', '_metricsin_component_content_');
			this.$templateCache.put ('app/components/metrics/metrics.raw.html', '{{ raw }}');
			this.$httpBackend.whenGET ('metrics').respond (200, {});
		});
	
		it ('should transition to metrics state', function () {
			spyOn (this.authFactory, 'hasAuthority').and.returnValue (true);
			this.$state.go ('metrics');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('metrics');
		});
	
		it ('should fail to transition to metrics if not authorized', function () {
			spyOn (this.authFactory, 'hasAuthority').and.returnValue (false);
			this.$state.go ('metrics');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('home');
		});

		it ('should refresh metrics', function () {
			this.$httpBackend.expectGET ('metrics').respond (200, {});
			this.scope.refresh ();
			this.$httpBackend.flush (); 
		});
	});
} ());
