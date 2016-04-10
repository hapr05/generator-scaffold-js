(function usersComponentTests () {
	'use strict';

	describe ('users component', function usersComponent () {
		beforeEach (function beforeEach () {
			inject (function inject ($componentController) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('users', { $scope: this.scope });
			});

			inject (function inject (authFactory) {
				this.authFactory = authFactory;
			});

			this.$templateCache.put ('app/components/users/users.view.html', '_usersin_component_content_');
			this.$templateCache.put ('app/components/users/users.raw.html', '{{ raw }}');
			this.$httpBackend.expectGET ('account/?limit=20&sortBy=username&sortDir=asc&start=0').respond (200, []);
		});

		it ('should transition to users state', function transitionToState () {
			this.authenticate (200);
			spyOn (this.authFactory, 'hasAnyAuthority').and.returnValue (true);
			this.$state.go ('users');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('users');
		});

		it ('should fail to transition to users if not authorized', function failToTransitionIfNotAuthorized () {
			this.authFactory.reset ();
			this.$state.go ('users');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('login');
		});

		it ('should search users', function loadLog () {
			this.$httpBackend.expectGET ('account/?limit=20&sortBy=username&sortDir=asc&start=0').respond (200, []);
			this.scope.search ();
			this.$httpBackend.flush ();
		});

		it ('should sort users', function loadLog () {
			this.$httpBackend.expectGET ('account/?limit=20&sortBy=username&sortDir=desc&start=0').respond (200, []);
			this.scope.sort ('username');
			this.$httpBackend.flush ();
			this.$httpBackend.expectGET ('account/?limit=20&sortBy=username&sortDir=asc&start=0').respond (200, []);
			this.scope.sort ('username');
			this.$httpBackend.flush ();
			this.$httpBackend.expectGET ('account/?limit=20&sortBy=email&sortDir=asc&start=0').respond (200, []);
			this.scope.sort ('email');
			this.$httpBackend.flush ();
		});
	});
} ());
