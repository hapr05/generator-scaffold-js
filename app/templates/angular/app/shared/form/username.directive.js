(function usernameDirective () {
	'use strict';

	angular.module ('<%= appSlug %>').directive ('<%= appCamel %>Username', function directive ($q, accountFactory) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link (scope, elm, attrs, ctrl) {
				ctrl.$asyncValidators.taken = function taken (modelValue) {
					if (ctrl.$isEmpty (modelValue)) {
						return $q.when ();
					} else {
						return accountFactory.available (modelValue);
					}
				};
			}
		};
	});
} ());
