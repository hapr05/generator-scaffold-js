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

			this.$templateCache.put ('app/components/logs/logs.view.html', '_login_component_content_');
			this.$templateCache.put ('app/components/logs/logs.raw.html', '{{ raw }}');
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
			this.$httpBackend.expectGET (/logs\/\?from=(.+)&to=(.+)/).respond (200, []);
			this.scope.view ();
			this.$httpBackend.flush (); 
		});

		it ('should load log filtered by event', function () {
			this.$httpBackend.expectGET (/logs\/\?event=test&from=(.+)&to=(.+)/).respond (200, []);
			this.scope.filter.event = 'log.event.test';
			this.scope.view ();
			this.$httpBackend.flush (); 
		});

		it ('should show raw log', function () {
			this.$httpBackend.expectGET (/logs\/\?from=(.+)&to=(.+)/).respond (200, [{ test: 1}]);
			this.scope.view ();
			this.$httpBackend.flush (); 
			this.scope.raw (0);
			this.scope.$digest ();
		});

		it ('should clear dates', function () {
			this.scope.filter.from = false;
			this.$rootScope.$digest ();
			expect (this.scope.filter.dates).toEqual ('');
		});
	});
} ());
