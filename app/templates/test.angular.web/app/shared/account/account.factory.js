(function () {
	'use strict';

	describe ('account factory', function () {
		beforeEach (function () {
			inject (function (accountFactory) {
				this.accountFactory = accountFactory;
			});
		});
	
		it ('should indicate available', function () {
			this.$httpBackend.expectGET ('account/test').respond (404);
			this.accountFactory.available ('test');
			this.$httpBackend.flush ();
		});
	
		it ('should indicate unavailable', function () {
			this.$httpBackend.expectGET ('account/?email=test').respond (200);
			this.accountFactory.available (null, 'test');
			this.$httpBackend.flush ();
		});
	
		it ('should create account', function () {
			this.$httpBackend.expectPOST ('account/').respond (200);
			this.accountFactory.create ({});
			this.$httpBackend.flush ();
		});
	});
} ());

