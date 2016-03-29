(function () {
	'use strict';

	describe ('email directive', function () {

		beforeEach (function () {
			inject (function (accountFactory) {
				this.accountFactory = accountFactory;
			});
			this.$httpBackend.whenGET ('account/?email=test').respond (200);
			this.$compile (angular.element ('<form name="form"><input <%= appSlug %>-email name="email" ng-model="email" /></form>')) (this.$rootScope);
			this.form = this.$rootScope.form;
		});

		it ('should error if exists', function () {
			this.form.email.$setViewValue ('test');
			this.$rootScope.$digest();
			expect (this.form.email.$valid).toBeFalsy ();
		});

		it ('should ignore empty', function () {
			this.form.email.$setViewValue ('');
			this.$rootScope.$digest();
			expect (this.form.email.$valid).toBeTruthy ();
		});
	});
} ());
