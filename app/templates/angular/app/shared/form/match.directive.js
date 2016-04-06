(function matchDirective () {
	'use strict';

	angular.module ('<%= appSlug %>').directive ('<%= appCamel %>Match', function directive () {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: true,
			link: function link (scope, elm, attrs, ctrl) {
				scope.$watch (function watchVar () {
					var match = scope.$eval (attrs.<%= appCamel %>Match);

					return match ? scope.$eval (attrs.ngModel) === match : true;
				}, function watchHandler (valid) {
					ctrl.$setValidity ('match', valid);
				});
			}
		};
	});
} ());
