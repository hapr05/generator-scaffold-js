(function passwordDirectiveTests () {
	'use strict';

	describe ('password directive', function passwordDirective () {
		beforeEach (function beforeEach () {
			this.$templateCache.put ('app/shared/form/password.strength.html', '<div></div>');

			this.$compile (
				angular.element (
					'<form name="form"><input <%= appSlug %>-password-valid name="password" ng-model="password" /><<%= appSlug %>-password-strength password="password"></<%= appSlug %>-password-strength></form>'
				)
			) (this.$rootScope);
			this.form = this.$rootScope.form;
		});

		it ('should error if invalid', function errorIfInvalid () {
			this.form.password.$setViewValue ('test');
			this.$rootScope.$digest ();
			expect (this.form.password.$valid).toBeFalsy ();
		});

		it ('should ignore empty', function ignoreEmpty () {
			this.form.password.$setViewValue ('');
			this.$rootScope.$digest ();
			expect (this.form.password.$valid).toBeTruthy ();
		});
	});
} ());
