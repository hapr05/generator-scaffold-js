(function emailDirectiveTests () {
	'use strict';

	describe ('email directive', function emailDirective () {
		beforeEach (function beforeEach () {
			inject (function inject (accountFactory) {
				this.accountFactory = accountFactory;
			});
			this.$httpBackend.whenGET ('account/?email=test').respond (200);
			this.$compile (angular.element ('<form name="form"><input <%= appSlug %>-email name="email" ng-model="email" /></form>')) (this.$rootScope);
			this.form = this.$rootScope.form;
		});

		it ('should error if exists', function errorIfExists () {
			this.form.email.$setViewValue ('test');
			this.$rootScope.$digest ();
			expect (this.form.email.$valid).toBeFalsy ();
		});

		it ('should ignore empty', function ignoreEmpty () {
			this.form.email.$setViewValue ('');
			this.$rootScope.$digest ();
			expect (this.form.email.$valid).toBeTruthy ();
		});
	});

	describe ('email change directive', function emailDirective () {
		beforeEach (function beforeEach () {
			inject (function inject (accountFactory) {
				this.accountFactory = accountFactory;
			});
			this.$httpBackend.whenGET ('account/?email=test').respond (200);
			this.$compile (angular.element ('<form name="form"><input <%= appSlug %>-email-change name="email" ng-model="email" /></form>')) (this.$rootScope);
			this.form = this.$rootScope.form;
		});

		it ('should gnore if matches current', function errorIfExists () {
			this.form.email.$setViewValue (undefined);
			this.$rootScope.$digest ();
			expect (this.form.email.$valid).toBeTruthy ();
		});

		it ('should gnore if matches editing', function errorIfExists () {
			this.$compile (angular.element ('<form name="form"><input <%= appSlug %>-email-change="origEmail" name="email" ng-model="email" /></form>')) (this.$rootScope);
			this.form = this.$rootScope.form;
			this.$rootScope.origEmail = 'test';
			this.form.email.$setViewValue ('test');
			this.$rootScope.$digest ();
			expect (this.form.email.$valid).toBeTruthy ();
		});

		it ('should error if exists', function errorIfExists () {
			this.form.email.$setViewValue ('test');
			this.$rootScope.$digest ();
			expect (this.form.email.$valid).toBeFalsy ();
		});

		it ('should ignore empty', function ignoreEmpty () {
			this.form.email.$setViewValue ('');
			this.$rootScope.$digest ();
			expect (this.form.email.$valid).toBeTruthy ();
		});
	});
} ());
