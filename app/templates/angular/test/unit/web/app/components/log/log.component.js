(function logComponentTests () {
	'use strict';

	describe ('log component', function logComponent () {
		beforeEach (function beforeEach () {
			inject (function inject ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('log', { $scope: this.scope });
			});

			inject (function inject (authFactory) {
				this.authFactory = authFactory;
			});

			this.$templateCache.put ('app/components/log/log.view.html', '_login_component_content_');
			this.$templateCache.put ('app/components/log/log.raw.html', '{{ raw }}');
		});

		it ('should transition to log state', function transitionToState () {
			this.authenticate (200);
			spyOn (this.authFactory, 'hasAnyAuthority').and.returnValue (true);
			this.$state.go ('log');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('log');
		});

		it ('should fail to transition to log if not authorized', function failToTransitionIfNotAuthorized () {
			this.authFactory.reset ();
			this.$state.go ('log');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('login');
		});

		it ('should load log', function loadLog () {
			this.$httpBackend.expectGET (/log\/\?from=(.+)&to=(.+)/).respond (200, []);
			this.scope.view ();
			this.$httpBackend.flush ();
		});

		it ('should export log', function exportLog () {
			window.saveAs = jasmine.createSpy ();
			this.$httpBackend.expectGET (/log\/\?from=(.+)&to=(.+)/).respond (200, []);
			this.scope.export ();
			this.$httpBackend.flush ();
			expect (window.saveAs).toHaveBeenCalled ();
		});

		it ('should sort logs ', function loadLog () {
			this.$httpBackend.expectGET (/log\/\?from=(.+)&limit=10&sortBy=timestamp&sortDir=desc&start=0&to=(.+)/).respond (200, []);
			this.scope.sort ('timestamp');
			this.$httpBackend.flush ();
			this.$httpBackend.expectGET (/log\/\?from=(.+)&limit=10&sortBy=timestamp&sortDir=asc&start=0&to=(.+)/).respond (200, []);
			this.scope.sort ('timestamp');
			this.$httpBackend.flush ();
			this.$httpBackend.expectGET (/log\/\?from=(.+)&limit=10&sortBy=event&sortDir=asc&start=0&to=(.+)/).respond (200, []);
			this.scope.sort ('event');
			this.$httpBackend.flush ();
		});

		it ('should load log filtered by event', function filterByEvent () {
			this.$httpBackend.expectGET (/log\/\?event=test&from=(.+)&to=(.+)/).respond (200, []);
			this.scope.filter.event = 'log.event.test';
			this.scope.view ();
			this.$httpBackend.flush ();
		});

		it ('should export log filtered by event', function exportLog () {
			window.saveAs = jasmine.createSpy ();
			this.$httpBackend.expectGET (/log\/\?event=test&from=(.+)&to=(.+)/).respond (200, []);
			this.scope.filter.event = 'log.event.test';
			this.scope.export ();
			this.$httpBackend.flush ();
			expect (window.saveAs).toHaveBeenCalled ();
		});

		it ('should show raw log', function showRawLog () {
			this.$httpBackend.expectGET (/log\/\?from=(.+)&to=(.+)/).respond (200, [{ test: 1 }]);
			this.scope.view ();
			this.$httpBackend.flush ();
			this.scope.raw (0);
			this.scope.$digest ();
		});

		it ('should clear dates', function clearDates () {
			this.scope.filter.from = false;
			this.$rootScope.$digest ();
			expect (this.scope.filter.dates).toEqual ('');
		});
	});
} ());
