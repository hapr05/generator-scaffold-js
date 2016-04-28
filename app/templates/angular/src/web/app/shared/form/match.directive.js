/**
 * Match directive
 * @class client.<%= appSlug %>.matchDirective
 */
(function matchDirective () {
	'use strict';

	/**
	 * Validates two inputs match
	 * @function client.<%= appSlug %>.matchDirective#<%= appCamel %>Match
	 * @public
	 */
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
