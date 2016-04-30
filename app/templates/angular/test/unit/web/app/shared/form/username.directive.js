(function usernameDirectiveTests () {
	'use strict';

	describe ('username directive', function usernameDirective () {
		beforeEach (function beforeEach () {
			inject (function inject (accountFactory) {
				this.accountFactory = accountFactory;
			});
			this.$httpBackend.whenGET ('account/?username=test').respond (200);
			this.$compile (angular.element ('<form name="form"><input <%= appSlug %>-username name="username" ng-model="username" /></form>')) (this.$rootScope);
			this.form = this.$rootScope.form;
		});

		it ('should error if exists', function errorIfExists () {
			this.form.username.$setViewValue ('test');
			this.$rootScope.$digest ();
			expect (this.form.username.$valid).toBeFalsy ();
		});

		it ('should ignore empty', function ignoreEmpty () {
			this.form.username.$setViewValue ('');
			this.$rootScope.$digest ();
			expect (this.form.username.$valid).toBeTruthy ();
		});
	});
} ());
