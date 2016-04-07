(function matchDirective () {
	'use strict';

	angular.module ('<%= appSlug %>').directive ('<%= appCamel %>Match', function directive () {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: true,
			link: function link (scope, elm, attrs, ctrl) {
				scope.$watch (function watchVar () {
					var one = scope.$eval (attrs.<%= appCamel %>Match),
						two = scope.$eval (attrs.ngModel);

					return one && two ? one === two : true;
				}, function watchHandler (valid) {
					ctrl.$setValidity ('match', valid);
				});
			}
		};
	});
} ());
