(function emailDirective () {
	'use strict';

	angular.module ('<%= appSlug %>').directive ('<%= appCamel %>Email', function directive ($q, accountFactory) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link (scope, elm, attrs, ctrl) {
				ctrl.$asyncValidators.taken = function taken (modelValue) {
					if (ctrl.$isEmpty (modelValue)) {
						return $q.when ();
					} else {
						return accountFactory.available (false, modelValue);
					}
				};
			}
		};
	}).directive ('<%= appCamel %>EmailChange', function directive ($q, accountFactory) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function link (scope, elm, attrs, ctrl) {
				ctrl.$asyncValidators.taken = function taken (modelValue) {
					if (modelValue === accountFactory.email || ctrl.$isEmpty (modelValue)) {
						return $q.when ();
					} else {
						return accountFactory.available (false, modelValue);
					}
				};
			}
		};
	});
} ());
