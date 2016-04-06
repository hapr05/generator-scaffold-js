(function accountFactoryTests () {
	'use strict';

	describe ('account factory', function accountFactory () {
		beforeEach (function beforeEach () {
			inject (function inject (accountFactory) {
				this.accountFactory = accountFactory;
			});
		});

		it ('should indicate available', function indicateAvailable () {
			this.$httpBackend.expectGET ('account/test').respond (404);
			this.accountFactory.available ('test');
			this.$httpBackend.flush ();
		});

		it ('should indicate unavailable', function indicateUnavalable () {
			this.$httpBackend.expectGET ('account/?email=test').respond (200);
			this.accountFactory.available (null, 'test');
			this.$httpBackend.flush ();
		});

		it ('should create account', function createAccount () {
			this.$httpBackend.expectPOST ('account/').respond (200);
			this.accountFactory.create ({});
			this.$httpBackend.flush ();
		});
	});
} ());

