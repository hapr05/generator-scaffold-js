(function matchDirectiveTests () {
	'use strict';

	describe ('match directive', function matchDirective () {
		beforeEach (function beforeEach () {
			inject (function inject (accountFactory) {
				this.accountFactory = accountFactory;
			});
			this.$compile (angular.element ('<form name="form"><input name="other" ng-model="other" /><input <%= appSlug %>-match="other" name="match" ng-model="match" /></form>')) (this.$rootScope);
			this.form = this.$rootScope.form;
		});

		it ('should error if doese not match', function errorIfNoMatch () {
			this.form.other.$setViewValue ('not-test');
			this.form.match.$setViewValue ('test');
			this.$rootScope.$digest ();
			expect (this.form.match.$valid).toBeFalsy ();
		});

		it ('should succeed if matches', function succeedIfMatches () {
			this.form.other.$setViewValue ('test');
			this.form.match.$setViewValue ('test');
			this.$rootScope.$digest ();
			expect (this.form.match.$valid).toBeTruthy ();
		});

		it ('should ignore if other is empty', function ignoreIfEmpty () {
			this.form.other.$setViewValue ('');
			this.form.match.$setViewValue ('test');
			this.$rootScope.$digest ();
			expect (this.form.match.$valid).toBeTruthy ();
		});
	});
} ());
