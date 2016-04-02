(function () {
	'use strict';

	describe ('audit component', function () {
		beforeEach (function () {
			inject (function ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('audit', { $scope: this.scope });
			});

			inject (function (authFactory) {
				this.authFactory = authFactory;
			});

			this.$templateCache.put ('app/components/audit/audit.view.html', '_auditin_component_content_');
			this.$templateCache.put ('app/components/audit/audit.raw.html', '{{ raw }}');
		});
	
		it ('should transition to audit state', function () {
			spyOn (this.authFactory, 'hasAuthority').and.returnValue (true);
			this.$state.go ('audit');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('audit');
		});
	
		it ('should fail to transition to audit if not authorized', function () {
			spyOn (this.authFactory, 'hasAuthority').and.returnValue (false);
			this.$state.go ('audit');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('home');
		});

		it ('should load audit', function () {
			this.$httpBackend.expectGET (/audit\/\?from=(.+)&to=(.+)/).respond (200, []);
			this.scope.view ();
			this.$httpBackend.flush (); 
		});

		it ('should load audit filtered by event', function () {
			this.$httpBackend.expectGET (/audit\/\?event=test&from=(.+)&to=(.+)/).respond (200, []);
			this.scope.filter.event = 'audit.event.test';
			this.scope.view ();
			this.$httpBackend.flush (); 
		});

		it ('should load audit filtered by username', function () {
			this.$httpBackend.expectGET (/audit\/\?from=(.+)&to=(.+)&username=test/).respond (200, []);
			this.scope.filter.username = 'test';
			this.scope.view ();
			this.$httpBackend.flush (); 
		});

		it ('should clear dates', function () {
			this.scope.filter.from = false;
			this.$rootScope.$digest ();
			expect (this.scope.filter.dates).toEqual ('');
		});
	});
} ());
