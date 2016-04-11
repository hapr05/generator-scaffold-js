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
			this.$httpBackend.whenGET ('account/?limit=20&sortBy=username&sortDir=asc&start=0').respond (200, [ this.account ]);
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

		describe ('edit', function edit () {
			it ('should edit users', function loadLog () {
				this.scope.search ();
				this.$httpBackend.flush ();
				this.scope.edit (0);
				expect (this.scope.editIndex).toBe (0);
			});

			it ('should go back users', function loadLog () {
				this.scope.search ();
				this.$httpBackend.flush ();
				this.scope.edit (0);
				expect (this.scope.editIndex).toBe (0);
				this.scope.back ();
				expect (this.scope.editIndex).toBe (false);
			});

			it ('should update', function account () {
				this.scope.search ();
				this.$httpBackend.flush ();
				this.scope.edit (0);
				this.$httpBackend.expectPOST ('account/test').respond (200, this.account);
				this.scope.update ({
					preventDefault: function preventDefault () {}
				});
				this.$httpBackend.flush ();
				expect (this.scope.updateSuccess).toBeTruthy ();
			});

			it ('should handle update failure', function account () {
				this.scope.search ();
				this.$httpBackend.flush ();
				this.scope.edit (0);
				this.$httpBackend.expectPOST ('account/test').respond (400, this.account);
				this.scope.update ({
					preventDefault: function preventDefault () {}
				});
				this.$httpBackend.flush ();
				expect (this.scope.updateSuccess).toBeFalsy ();
			});
		});
	});
} ());
