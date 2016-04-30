(function metricsComponentTests () {
	'use strict';

	describe ('metrics component', function metricsComponent () {
		beforeEach (function beforeEach () {
			inject (function inject ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('metrics', { $scope: this.scope });
			});

			inject (function inject (authFactory) {
				this.authFactory = authFactory;
			});

			this.$templateCache.put ('app/components/metrics/metrics.view.html', '_metricsin_component_content_');
			this.$templateCache.put ('app/components/metrics/metrics.raw.html', '{{ raw }}');
			this.$httpBackend.whenGET ('metrics').respond (200, {});
		});

		it ('should transition to metrics state', function transitionToState () {
			this.authenticate (200);
			spyOn (this.authFactory, 'hasAnyAuthority').and.returnValue (true);
			this.$state.go ('metrics');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('metrics');
		});

		it ('should fail to transition to metrics if not authorized', function failToTransitionIfNotAuthorized () {
			this.authFactory.reset ();
			this.$state.go ('metrics');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('login');
		});

		it ('should refresh metrics', function refreshMetrics () {
			this.$httpBackend.expectGET ('metrics').respond (200, {});
			this.scope.refresh ();
			this.$httpBackend.flush ();
		});
	});
} ());
