(function accountComponentTests () {
	'use strict';

	describe ('account component', function accountComponent () {
		beforeEach (function beforeEach () {
			inject (function inject ($componentController, accountFactory) {
				this.scope = this.$rootScope.$new ();
				this.ctrl = $componentController ('account', { $scope: this.scope });
				this.accountFactory = accountFactory;
			});

			this.$templateCache.put ('app/components/account/account.view.html', '_account_component_content_');
		});

		it ('should transition to account state', function transitionToState () {
			this.authenticate (200);
			this.$state.go ('account');
			this.$rootScope.$digest ();
			expect (this.$state.current.name).toBe ('account');
		});

		it ('should load', function load () {
			var el = this.$compile ('<account></account>') (this.$rootScope);

			this.$rootScope.$digest ();
			expect (el.html ()).toContain ('_account_component_content_');
		});

		it ('should update', function account () {
			this.$httpBackend.expectGET ('account/test').respond (200, this.account);
			this.accountFactory.get ('test');
			this.$httpBackend.flush ();
			this.$httpBackend.expectPOST ('account/').respond (200, this.account);
			this.scope.update ({
				preventDefault: function preventDefault () {}
			});
			this.$httpBackend.flush ();
			expect (this.scope.updateSuccess).toBeTruthy ();
		});

		it ('should handle update failure', function account () {
			this.$httpBackend.expectGET ('account/test').respond (200, this.account);
			this.accountFactory.get ('test');
			this.$httpBackend.flush ();
			this.$httpBackend.expectPOST ('account/').respond (400, this.account);
			this.scope.update ({
				preventDefault: function preventDefault () {}
			});
			this.$httpBackend.flush ();
			expect (this.scope.updateSuccess).toBeFalsy ();
		});
	});
} ());
