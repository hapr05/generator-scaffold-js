(function () {
	'use strict';

	angular.module ('<%= appSlug %>').directive ('<%= appCamel %>Username', function ($q, accountFactory) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elm, attrs, ctrl) {
				ctrl.$asyncValidators.taken = function (modelValue) {
					if (ctrl.$isEmpty(modelValue)) {
						return $q.when ();
					} else {
						return accountFactory.available (modelValue);
					}
				};
			}   
		};  
	});
} ());
