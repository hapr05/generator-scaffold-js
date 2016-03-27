(function () {
	'use strict';

	angular.module ('<%= appSlug %>').directive ('<%= appCamel %>Match', function () {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: true,
			link: function (scope, elm, attrs, ctrl) {
				scope.$watch (function () {
					var match = scope.$eval (attrs.<%= appCamel %>Match);
					return match ? scope.$eval (attrs.ngModel) === match : true;
				}, function (valid) {
					ctrl.$setValidity ('match', valid);
				});
			}   
		};  
	});
} ());
