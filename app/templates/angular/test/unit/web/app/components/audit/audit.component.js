(function auditComponentTests () {
	'use strict';

	describe ('audit component', function auditComponent () {
		beforeEach (function beforeEach () {
			inject (function inject ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('audit', { $scope: this.scope });
			});

			inject (function inject (authFactory) {
				this.authFactory = authFactory;
			});

			this.$templateCache.put ('app/components/audit/audit.view.html', '_auditin_component_content_');
			this.$templateCache.put ('app/components/audit/audit.raw.html', '{{ raw }}');
		});

		it ('should transition to audit state', function transitionToState () {
			this.authenticate (200);
			spyOn (this.authFactory, 'hasAnyAuthority').and.returnValue (true);
			this.$state.go ('audit');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('audit');
		});

		it ('should fail to transition to audit if not authorized', function failToTransitionIfNotAuthorized () {
			this.authFactory.reset ();
			this.$state.go ('audit');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('login');
		});

		it ('should load audit', function loadAudit () {
			this.$httpBackend.expectGET (/audit\/\?from=(.+)&to=(.+)/).respond (200, []);
			this.scope.view ();
			this.$httpBackend.flush ();
		});

		it ('should export audit', function exportAudit () {
			window.saveAs = jasmine.createSpy ();
			this.$httpBackend.expectGET (/audit\/\?from=(.+)&to=(.+)/).respond (200, []);
			this.scope.export ();
			this.$httpBackend.flush ();
			expect (window.saveAs).toHaveBeenCalled ();
		});

		it ('should sort audit', function loadLog () {
			this.$httpBackend.expectGET (/audit\/\?from=(.+)&limit=20&sortBy=timestamp&sortDir=desc&start=0&to=(.+)/).respond (200, []);
			this.scope.sort ('timestamp');
			this.$httpBackend.flush ();
			this.$httpBackend.expectGET (/audit\/\?from=(.+)&limit=20&sortBy=timestamp&sortDir=asc&start=0&to=(.+)/).respond (200, []);
			this.scope.sort ('timestamp');
			this.$httpBackend.flush ();
			this.$httpBackend.expectGET (/audit\/\?from=(.+)&limit=20&sortBy=event&sortDir=asc&start=0&to=(.+)/).respond (200, []);
			this.scope.sort ('event');
			this.$httpBackend.flush ();
		});

		it ('should load audit filtered by event', function filterAuditByEvent () {
			this.$httpBackend.expectGET (/audit\/\?event=test&from=(.+)&to=(.+)/).respond (200, []);
			this.scope.filter.event = 'audit.event.test';
			this.scope.view ();
			this.$httpBackend.flush ();
		});

		it ('should export audit filteredi by event', function exportAudit () {
			window.saveAs = jasmine.createSpy ();
			this.$httpBackend.expectGET (/audit\/\?event=test&from=(.+)&to=(.+)/).respond (200, []);
			this.scope.filter.event = 'audit.event.test';
			this.scope.export ();
			this.$httpBackend.flush ();
			expect (window.saveAs).toHaveBeenCalled ();
		});

		it ('should load audit filtered by username', function filterAuditByUsername () {
			this.$httpBackend.expectGET (/audit\/\?from=(.+)&to=(.+)&username=test/).respond (200, []);
			this.scope.filter.username = 'test';
			this.scope.view ();
			this.$httpBackend.flush ();
		});

		it ('should clear dates', function clearDates () {
			this.scope.filter.from = false;
			this.$rootScope.$digest ();
			expect (this.scope.filter.dates).toEqual ('');
		});
	});
} ());
